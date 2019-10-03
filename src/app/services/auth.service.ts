
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    constructor() {
    }

    login(email: string, password: string, callback: (result: boolean) => void) {
        // todo
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
