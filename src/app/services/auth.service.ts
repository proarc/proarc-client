

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
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
        private api: ApiService,
        private router: Router,
        private config: ConfigService) {
    }

    login(username: string, password: string, callback: (result: boolean, err: any) => void) {
        const httpOptions = {
            responseType: 'text',
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }),
        } as any;
        const data = `j_username=${username}&j_password=${password}`;
        return this.http.post(`${this.api.getBaseUrl()}/proarclogin`, data, httpOptions)
            .subscribe((result) => {
                this.api.getUser().subscribe((user: User) => {
                    this.user = user;
                    callback(true, null);
                },
                    (error) => {
                        this.user = null;
                        callback(false, error);
                    });
            }, (error) => {
                console.log('login error', error);
                callback(false, error);
            })
    }

    setLoggedOut() {
        this.user = null;
        this.router.navigate(['/login']);
    }

    logout() {
        return this.http.delete(`${this.api.getBaseUrl()}/proarclogin`).subscribe((result) => {
            this.user = null;
            this.router.navigate(['/login']);
        });
    }


    checkOnStart() {
        this.api.getUser().subscribe((user: User) => {
            this.user = user;
        },
            (error) => {
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
        return this.http.get('api/isLogged')
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
            } else if(res.state === 'logged') {
              this.remaining = res.remaining;
              this.remainingPercent =  this.remaining * 100.0 / res.maximum;
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
              alert(this.translator.instant('alert.sessionTimeout'));
              this.setLoggedOut();
            }
          });
        //} else {
        //  clearInterval(this.loggedChecker);
        }
      }

    public getBaseUrl(): string {
        return this.config.proarcBackendUrl;
    }

    public getApiUrl(): string {
        return `${this.getBaseUrl()}/rest/v2/`
    }

    initializeAppOld(): Promise<any> {
        console.log('initializeApp');
        return new Promise((resolve, reject) => {
            this.http.get(this.getApiUrl() + 'user?whoAmI=true')
                // .pipe(catchError(err => this.handleError))
                .subscribe(
                    (user: any) => {
                        this.user = User.fromJson(user['response']['data'][0]);
                        this.api.getValuemap().subscribe(resp => {
                            this.config.valueMap = resp.response.data;
                            resolve(true);
                        });
                        // resolve(true);
                    },
                    (error: any) => {
                        console.log(error.message);
                        resolve(true);
                    });
        });
    }

    public initializeApp() {

        return this.api.getConfig().pipe(
            switchMap((configResp: any) => {
                if (configResp.response?.data && !configResp.response.data[0].error) {
                    this.config.mergeConfig(JSON.parse(configResp.response.data[0].configFile));
                }
                return this.api.getValuemap().pipe(
                    switchMap((res: any) => {
                        this.config.valueMap = res.response.data;
                        return this.http.get(this.getApiUrl() + 'user?whoAmI=true').pipe(
                            tap((user: any) => {
                                this.user = User.fromJson(user['response']['data'][0]);
                            })
                        );
                    }),
                    catchError((err) => {
                        return of(err);
                    })
        )}));
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
