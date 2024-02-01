import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { ApiService } from '../services/api.service';

declare var APP_GLOBAL: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public showFooter: boolean = this.config.showFooter;

  constructor(private translator: TranslateService,
    public auth: AuthService,
    private router: Router,
    private config: ConfigService,
    private api: ApiService
  ) {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translator.use(lang);
    } else if (APP_GLOBAL.lang) {
      this.translator.use(APP_GLOBAL.lang);
    } else {
      this.translator.use('cs');
    }


    // this.auth.checkOnStart();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).gaaa('set', 'page', event.urlAfterRedirects);
        (<any>window).gaaa('send', 'pageview');
      }
    });

    if (this.auth.user && !this.config.valueMap) {
      this.api.getValuemap().subscribe(resp => {
        this.config.valueMap = resp.response.data;
      });
    }
  }
}
