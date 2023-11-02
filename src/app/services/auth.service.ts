

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { Observable, tap } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class AuthService {

    public user: User;

    constructor(
        private http: HttpClient, 
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

    checkLogin(): () => Observable<any> {
        return () => this.http.get('user?whoAmI=true')
            .pipe(
                tap(user => {
                    console.log('user');
                    this.user = user as User;
                })
            );
    }

    public getBaseUrl(): string {
        return this.config.proarcBackendUrl;
    }

    public getApiUrl(): string {
        return `${this.getBaseUrl()}/rest/v2/`
    }

    initializeApp(): Promise<any> {
        console.log('initializeApp');
        return new Promise((resolve, reject) => {
            this.http.get(this.getApiUrl() + 'user?whoAmI=true')
                // .pipe(catchError(err => this.handleError))
                .subscribe(
                    (user: any) => {
                        this.user = User.fromJson(user['response']['data'][0]);
                        resolve(true);
                    },
                    (error: any) => {
                        console.log(error.message);
                        resolve(true);
                    });
        });
    }

    handleError(error: HttpErrorResponse) {
        console.log(error)
    }

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
