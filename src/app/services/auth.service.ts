
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    private loggedIn = false;

    constructor(private http: HttpClient, private router: Router) {
    }

    login(username: string, password: string, callback: (result: boolean) => void) {
        const httpOptions = {
            responseType: 'text',
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }),
        } as any;
        const data = `j_username=${username}&j_password=${password}`;
        return this.http.post(`${ApiService.baseUrl}/proarclogin`, data, httpOptions)
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
        return this.http.delete(`${ApiService.baseUrl}/proarclogin`).subscribe((result) => {
            this.loggedIn = false;
            this.router.navigate(['/login']);
        });
    }


    checkOnStart() {
        return this.http.get(`${ApiService.apiUrl}user?whoAmI=true`).subscribe((result) => {
            this.loggedIn = true;
        },
        (error) => {
            this.loggedIn = false;
            this.router.navigate(['/login']);
        });
    }





    login2(email: string, password: string, callback: (result: boolean) => void) {
        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type':  'application/x-www-form-urlencoded; charset=utf-8'
        //     }),
        //     responseType: 'text'
        // };

        // const op = {
        //     headers: {
        //         // 'Content-Type':  'application/x-www-form-urlencoded; charset=UTF-8'
        //     }
        // };

        // var credentials: any = new FormData();
        // credentials.append("j_username", 'proarc');
        // credentials.append("j_password", 'N8dra69');
        // email = 'proarc';
        // password = 'N8dra69';

        // const credentials = `j_username=${email}&j_password=${password}`;

        // this.http.post(`${this.baseUrl}/proarclogin`, credentials, httpOptions).subscribe((result) => {
        //     console.log('result', result);

        // this.http.get(`${this.baseUrl}/rest/v1/object/search?type=lastCreated&queryModel=model%3Andkperiodical`).subscribe((result) => {
        //     console.log('result', result);
        // });


        // });





        // http://krameriustest.inovatika.cz/proarc-silvarium/rest/v1/object/search?type=lastCreated&queryModel=model%3Andkperiodical

        0

        localStorage.setItem('loggedIn', 'yes');
        callback(true);
    }

    logout2(callback: (result: boolean) => void) {
        localStorage.removeItem('loggedIn');
        callback(true);
    }

    isLoggedIn(): boolean {
        return this.loggedIn; //localStorage.getItem('loggedIn') === 'yes';
    }

}
