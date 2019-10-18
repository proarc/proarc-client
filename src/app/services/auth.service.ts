
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {


    constructor(private http: HttpClient) {
    }

    login(email: string, password: string, callback: (result: boolean) => void) {
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

    logout(callback: (result: boolean) => void) {
        localStorage.removeItem('loggedIn');
        callback(true);
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('loggedIn') === 'yes';
    }

}
