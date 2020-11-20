

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
            this.api.getUser().subscribe((user: User) => {
                this.user = user;
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
        this.api.getUser().subscribe((user: User) => {
            this.user = user;
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

    isAdmin(): boolean {
        return this.user && this.user.role == "admin";
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
