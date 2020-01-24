import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  state = 'init';

  constructor(private auth: AuthService, 
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.state = 'loading';
    const email = form.value.email;
    const password = form.value.password;
    this.auth.login(email, password, (result) => {
      if (result) {
        this.router.navigate(['/']);
      } else {
        this.state = 'error';
      }
    });
    // this.authService.login(email, password, (result: boolean) => {
    //   if (result) {
    //     this.state = 'success';
    //     this.router.navigate(['/']);
    //   } else {
    //     this.state = 'error';
    //   }
    // });
  }

}
