import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @ViewChild('name') name: ElementRef;
  @ViewChild('surname') surname: ElementRef;
  @ViewChild('password') password: ElementRef;

  users: User[];
  selectedUser: User;
  roles = ['user', 'admin', 'superAdmin'];
  organizations: string[];

  displayedColumns: string[] = ['name', 'forename', 'surname', 'email', 'organization', 'role', 'home', 'changeModelFunction', 'updateModelFunction', 'lockObjectFunction', 'unlockObjectFunction', 'action'];

  constructor(
    private translator: TranslateService,
    private config: ConfigService,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService) { }

  ngOnInit(): void {
    this.getUsers(-1);
    this.organizations = this.config.organizations;
  }

  getUsers(id: number) {
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
      if (id === -1) {
        this.selectedUser = this.users[0];
      } else {
        this.selectedUser = this.users.find(u => u.userId === id);
      }
      
    });
  }

  setControleFieldTimeout(selectedFiled: any) {
    selectedFiled.nativeElement.focus();
    setTimeout(() => {selectedFiled.nativeElement.blur();}, 5);
    setTimeout(() => {selectedFiled.nativeElement.focus();}, 50);
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  save() {
    if (!this.selectedUser.name ) {
      this.setControleFieldTimeout(this.name);
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
        this.getUsers(user.userId);
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.addNewUser.success')));
        
      });
    } else {
      this.api.saveUser(this.selectedUser).subscribe((user: User) => {
        this.selectedUser = user;
      });
    }
  }

  newUser() {
    const newUser: User = User.fromJson({name: 'user_name', role: 'user', userId: -1});
    this.users.push(newUser);
    this.selectedUser = newUser;
  }

  deleteUser() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.deleteUser.title')),
      message: String(this.translator.instant('dialog.deleteUser.message', { name:this.selectedUser.name })),
      alertClass: 'app-message',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { 
      data: data,
      width: '400px',
      panelClass: 'app-simple-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.api.deleteUser(this.selectedUser).subscribe((response: any) => {
          if (response['response'].errors) {
            this.ui.showErrorDialogFromObject(response['response'].errors);
            return;
          }
          this.getUsers(-1);
        });
      }
    }); 
  }

}
