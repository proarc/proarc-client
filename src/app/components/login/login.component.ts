import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  state = 'none';

  error: string;

  constructor(private auth: AuthService, 
              private router: Router) { }

  ngOnInit() {
    this.error = null;
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
    this.auth.login(username, password, (result) => {
      this.state = 'none';
      if (result) {
        this.router.navigate(['/']);
      } else {
        this.error = "login_failed";
      }
    });
  }

}
