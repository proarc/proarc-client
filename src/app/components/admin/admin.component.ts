import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: User[];
  selectedUser: User;
  roles = ['user', 'admin', 'superAdmin']

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.selectedUser = this.users[0];
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  save() {
    this.api.saveUser(this.selectedUser).subscribe((user: User) => {
      this.selectedUser = user;
    });
  }

}
