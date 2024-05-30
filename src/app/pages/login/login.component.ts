import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('username') nameInput: MatInput;

  state = 'none';

  error: string;
  url: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(private auth: AuthService,
    public properties: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    private api: ApiService) { }

  ngOnInit() {
    this.error = null;
    setTimeout(() => {
      this.nameInput.focus();
    }, 100);
    this.url = this.route.snapshot.queryParams['url'];

  }

  onSubmit(form: NgForm) {
    this.error = null;
    const username = form.value.username;
    const password = form.value.password;
    if (!username || !password) {
      this.error = "missing_credentials";
      return;
    }
    this.state = 'loading';
    this.auth.login(username, password, (result: boolean, error: any) => {
      this.state = 'none';
      if (result) {
        this.properties.setStringProperty('search.split.0', '60');
        if (this.url) {
          // split query params
          const parts = this.url.split('?')

          const params: any = Object.assign({}, this.route.snapshot.queryParams);
          params.url = null;

          this.router.navigate([this.url], { queryParams: params });
        } else {
          this.router.navigate(['/']);
        }
        this.api.getValuemap().subscribe(resp => {
          this.config.valueMap = resp.response.data;
        });

      } else {
        if (error.status === 503 || error.status === 504) {
          this.error = "service_unavailable";
        } else {
          this.error = "login_failed";
        }

      }
    });
  }

}
