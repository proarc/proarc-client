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

  state = 'init';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.state = 'loading';
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password, (result: boolean) => {
      if (result) {
        this.state = 'success';
        this.router.navigate(['/']);
      } else {
        this.state = 'error';
      }
    });
  }

}
