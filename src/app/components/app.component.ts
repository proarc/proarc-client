import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translator: TranslateService,
              private auth: AuthService,
              private router: Router
              ) {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translator.use(lang);
    } else {
      this.translator.use('cs');
    }
    this.auth.checkOnStart();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).gaaa('set', 'page', event.urlAfterRedirects);
        (<any>window).gaaa('send', 'pageview');
      }
    });
  }

}
