import { Component, OnInit } from '@angular/core';
import { Translator } from 'angular-translator';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public translator: Translator, public auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLanguageChanged(lang: string) {
    localStorage.setItem('lang', lang);
    this.translator.language = lang;
  }

  logout() {
    this.auth.logout();
  }

}
