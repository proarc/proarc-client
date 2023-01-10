import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInput } from '@angular/material/input';

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

  constructor(private auth: AuthService, 
              private router: Router,
              private route: ActivatedRoute) { }

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
        if (this.url) {
          this.router.navigate([this.url]);
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
