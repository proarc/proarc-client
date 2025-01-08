import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Configuration } from '../../shared/configuration';
import { TranslateModule } from '@ngx-translate/core';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, 
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule],
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
    // public properties: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private config: Configuration,
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
        // this.properties.setStringProperty('search.split.0', '60');
            console.log(this.url)
            if (this.url) {
              // split query params
              const parts = this.url.split('?')
              const params: any = Object.assign({}, this.route.snapshot.queryParams);
              params.url = null;
              this.router.navigate([this.url], { queryParams: params });
            } else {
              this.router.navigate(['/']);
            }


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
