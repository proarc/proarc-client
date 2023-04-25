import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  @ViewChild('name') name: ElementRef;
  @ViewChild('surname') surname: ElementRef;
  @ViewChild('password') password: ElementRef;

  public id: number;
  users: User[];
  selectedUser: any;

  roles = ['user', 'admin', 'superAdmin'];
  organizations: string[];

  constructor(
    private api: ApiService,        
    private router: Router,
    private translator: TranslateService,
    private route: ActivatedRoute,
    private ui: UIService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getUser();
      //this.reload();
    });
  }

  private getUser() {
    this.api.getUserDetail(this.id).subscribe((user: User) => {
      this.selectedUser = user;
    });
  }

  private getUsers() {
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.users.forEach(f => {
        if (f.userId == this.id) {
          this.selectedUser = f;
        }
      });
    });
  }

  setControleFieldTimeout(selectedFiled: any) {
    selectedFiled.nativeElement.focus();
    setTimeout(() => {selectedFiled.nativeElement.blur();}, 5);
    setTimeout(() => {selectedFiled.nativeElement.focus();}, 50);
  }

  save() {
    if (!this.selectedUser.name ) {
      this.setControleFieldTimeout(this.selectedUser.name);
      return;
    }

    if (!this.selectedUser.password && this.selectedUser.userId === -1 ) {
      this.setControleFieldTimeout(this.password);
      return;
    }

    if (!this.selectedUser.surname ) {
      this.setControleFieldTimeout(this.surname);
      return;
    }

    if (this.selectedUser.userId === -1) {
      this.api.newUser(this.selectedUser).subscribe((response: any) => {
        if (response['response'].errors) {
          this.ui.showErrorDialogFromObject(response['response'].errors);
          return; 
        }
        const user: User =  User.fromJson(response['response']['data'][0]);
        this.getUser();
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.addNewUser.success')));
        
      });
    } else {
      this.api.saveUser(this.selectedUser).subscribe((user: User) => {
        this.selectedUser = user;
      });
    }
  }
  
}
