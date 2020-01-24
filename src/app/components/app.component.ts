import { Component } from '@angular/core';
import { Translator } from 'angular-translator';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translator: Translator, private auth: AuthService) {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translator.language = lang;
    }
    auth.checkOnStart();
  }

}
