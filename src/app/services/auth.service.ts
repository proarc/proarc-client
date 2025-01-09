

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin, Observable, of, tap } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Configuration } from '../shared/configuration';
import { User } from '../model/user.model';
import { UserSettings } from '../shared/user-settings';
declare var APP_GLOBAL: any;

@Injectable({ providedIn: 'root' })
export class AuthService {

    public user: User;
    remaining = 0;
    remainingPercent = 100;
    loggedChecker: any;
    timerRemain: any;
    intervalMilis = 10000;

    constructor(
        private http: HttpClient,
        public translator: TranslateService,
        private dialogRef: MatDialog,
        private api: ApiService,
        private router: Router,
        private config: Configuration,
        private settings: UserSettings
    ) {
    }

    public initializeApp() {
        this.translator.use('cs');
        return firstValueFrom(
            this.http
                .get<User>(this.getApiUrl() + 'user?whoAmI=true')
                .pipe(
                    switchMap((user: any) => {
                        this.user = user['response']['data'][0];
                        return this.http.get('assets/config.json5', { responseType: 'text' }).pipe(
                            switchMap((cfg: any) => {
                                this.config.mergeConfig(cfg);
                                return this.getUserConfig();
                            })
                        )

                    }),
                    catchError((e: any) => {
                        console.log(e);
                        return of(e)
                    }))
        );
    }

    getUserConfig() {
        const valueMapReq = this.api.getValuemap();
        const configReq = this.api.getConfig();
        const checkLoggedReq = this.checkLogged();
        return forkJoin([valueMapReq, configReq, checkLoggedReq]).pipe(
            tap(([valueMapResp, configResp, checkLoggedResp]: [any, any, any]) => {
                if (configResp.response?.data && !configResp.response.data[0].error) {
                    this.config.mergeConfig(configResp.response.data[0].configFile);
                }
                this.settings.reset();
                this.config.valueMap = valueMapResp.response.data;
                if (checkLoggedResp?.state === 'logged') {
                    this.remaining = checkLoggedResp.remaining;
                    this.remainingPercent = this.remaining * 100.0 / checkLoggedResp.maximum;
                    this.checkIsLogged();
                }
            }));
    }



    login(username: string, password: string, callback: (result: boolean, err: any) => void) {
        const httpOptions = {
            responseType: 'text',
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }),
        } as any;
        const data = `j_username=${username}&j_password=${password}`;
        return this.http.post(`/api/proarclogin`, data, httpOptions)
            .subscribe((result) => {
                this.initializeApp().then(() => {
                    callback(true, null);
                })
            }, (error) => {
                console.log('login error', error);
                callback(false, error);
            })
    }

    setLoggedOut() {
        this.user = null;
        this.dialogRef.closeAll();
        this.router.navigate(['/login']);
    }

    logout() {
        return this.http.delete(`/api/proarclogin`).subscribe((result) => {
            this.user = null;
            this.router.navigate(['/login']);
        });
    }

    private handleError(error: HttpErrorResponse, me: any) {
        //  console.log(error);
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else if (error.status === 503 || error.status === 504) {
            // Forbiden. Redirect to login
            console.log("Service Unavailable");
            const url = me.router.routerState.snapshot.url;
            if (me.router) {
                me.router.navigate(['/login'], { url: url, err: '503' });
            }
        } else if (error.status === 403) {
            // Forbiden. Redirect to login
            console.log("Forbiden");
            // const url = me.router.routerState.snapshot.url;
            // if (me.router) {
            //   me.router.navigate(['/login'], {url: url});
            // }
        } else {
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        // return throwError({'status':error.status, 'message': error.message});
        return of({ response: { 'status': error.status, 'message': error.message, 'errors': [error.error] } });
    }

    checkLogged(): Observable<any> {
        return this.http.get(`/api/isLogged`)
            .pipe(map((r: any) => {
                if (r.response?.status === -1) {
                    r.response.errors = [{ errorMessage: r.response.errorMessage }];
                }
                return r;

            }))
            .pipe(catchError(err => this.handleError(err, this)));;
    }

    checkIsLogged() {
        if (this.isLoggedIn()) {
            this.checkLogged().subscribe((res: any) => {
                if (res?.response?.errors) {
                    clearInterval(this.loggedChecker);
                    clearInterval(this.timerRemain);
                    // nalert(this.translator.instant('alert.sessionTimeout'));
                    this.setLoggedOut();
                } else if (res.state === 'logged') {
                    this.remaining = res.remaining;
                    this.remainingPercent = this.remaining * 100.0 / res.maximum;
                    if (!this.loggedChecker) {
                        this.loggedChecker = setInterval(() => {
                            this.checkIsLogged();
                        }, this.intervalMilis);
                        this.timerRemain = setInterval(() => {
                            this.remaining--;
                        }, 1000);
                    }
                } else {
                    clearInterval(this.loggedChecker);
                    clearInterval(this.timerRemain);
                    alert(this.translator.instant('alert.info.sessionTimeout'));
                    this.setLoggedOut();
                }
            });
            //} else {
            //  clearInterval(this.loggedChecker);
        }
    }

    public getApiUrl(): string {
        return `/api/rest/v2/`
    }

    // handleError(error: HttpErrorResponse) {
    //     console.log(error)
    // }

    isLoggedIn(): boolean {
        return !!this.user;
    }

    isSuperAdmin(): boolean {
        return this.user && this.user.role == "superAdmin";
    }

    isAdmin(): boolean {
        return this.user && (this.user.role == "admin" || this.user.role == "superAdmin");
    }

    updateUser(user: User) {
        this.user = user;
    }

    getUser(): User {
        return this.user;
    }

    getUserId(): number {
        if (!this.user) {
            return null;
        }
        return this.user.userId;
    }

}
