

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { User } from '../model/user.model';

@Injectable()
export class AuthService {

    private user: User;

    constructor(private http: HttpClient, private api: ApiService, private router: Router) {
    }

    login(username: string, password: string, callback: (result: boolean) => void) {
        const httpOptions = {
            responseType: 'text',
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }),
        } as any;
        const data = `j_username=${username}&j_password=${password}`;
        return this.http.post(`${this.api.getBaseUrl()}/proarclogin`, data, httpOptions)
        .subscribe((result) => {
            console.log('login success', result);
            this.http.get(`${this.api.getApiUrl()}user?whoAmI=true`).subscribe((result) => {
                this.user = User.fromJson(result['response']['data'][0]);
                callback(true);
            },
            (error) => {
                this.user = null;
                callback(false);
            });
        }, (error) => {
            console.log('login error', error);
            callback(false);
        })
    }

    logout() {
        return this.http.delete(`${this.api.getBaseUrl()}/proarclogin`).subscribe((result) => {
            this.user = null;
            this.router.navigate(['/login']);
        });
    }


    checkOnStart() {
        this.http.get(`${this.api.getApiUrl()}user?whoAmI=true`).subscribe((result) => {
            console.log('result');
            this.user = User.fromJson(result['response']['data'][0]);
        },
        (error) => {
            this.user = null;
            this.router.navigate(['/login']);
        });
    }

    isLoggedIn(): boolean {
        return !!this.user;
    }

    isSuperAdmin(): boolean {
        return this.user && this.user.role == "superAdmin";
    }

}
