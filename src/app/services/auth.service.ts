
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    private loggedIn = false;

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
            this.loggedIn = true;
            callback(true);
        }, (error) => {
            console.log('login error', error);
            callback(false);
        })
    }

    logout() {
        return this.http.delete(`${this.api.getBaseUrl()}/proarclogin`).subscribe((result) => {
            this.loggedIn = false;
            this.router.navigate(['/login']);
        });
    }


    checkOnStart() {
        return this.http.get(`${this.api.getApiUrl()}user?whoAmI=true`).subscribe((result) => {
            this.loggedIn = true;
        },
        (error) => {
            this.loggedIn = false;
            this.router.navigate(['/login']);
        });
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

}
