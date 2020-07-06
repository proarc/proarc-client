import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  state = 'none';
  user: User;


  forename: string;
  surname: string;

  constructor(private api: ApiService, private auth: AuthService) { }

  ngOnInit() {
    this.api.getUser().subscribe((user: User) => {
      this.user = user;
      this.forename = this.user.forename;
      this.surname = this.user.surname;
    });
  }

  profileChanged(): boolean {
    if (!this.user) {
      return false;
    }
    return this.user.forename != this.forename || this.user.surname != this.surname;
  }

  seveProfile() {
    this.state = 'loading';
    this.api.editUser(this.user.userId, this.forename, this.surname).subscribe((user: User) => {
      this.user = user;
      this.forename = this.user.forename;
      this.surname = this.user.surname;
      this.auth.updateUser(user);
      this.state = 'none';
    });
  }

}
