import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private auth: AuthService, 
              private router: Router) { }

  ngOnInit() {
    this.error = null;
    setTimeout(() => {
      this.nameInput.focus();
    }, 100);
    
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
