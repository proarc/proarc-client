import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UIService } from 'src/app/services/ui.service';
import { ChangeOwnerDialogComponent } from './change-owner-dialog/change-owner-dialog.component';

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

  public selectedColumns = [
    { field: 'name', selected: true, width: 100 },
    { field: 'forename', selected: true, width: 100 },
    { field: 'surname', selected: true, width: 100 },
    { field: 'email', selected: true, width: 100 },
    { field: 'organization', selected: true, width: 100 },
    { field: 'role', selected: true, width: 100 },
    { field: 'home', selected: true, width: 100 },
    { field: 'changeModelFunction', selected: true, width: 100 },
    { field: 'updateModelFunction', selected: true, width: 100 },
    { field: 'lockObjectFunction', selected: true, width: 100 },
    { field: 'unlockObjectFunction', selected: true, width: 100 },
    { field: 'importToProdFunction', selected: true, width: 100 },
    { field: 'czidloFunction', selected: true, width: 100 },
    { field: 'importToCatalogFunction', selected: true, width: 100},
    { field: 'wfDeleteJobFunction', selected: true, width: 100},
    { field: 'action', selected: true, width: 100 }
  ];

  displayedColumns: string[] = ['name', 'forename', 'surname', 'email', 'organization', 'role', 'home', 'changeModelFunction', 'updateModelFunction',
    'lockObjectFunction', 'unlockObjectFunction', 'importToProdFunction', 'czidloFunction', 'importToCatalogFunction', 'wfDeleteJobFunction', 'action'];

  constructor(
    private translator: TranslateService,
    private config: ConfigService,
    public auth: AuthService,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService,
    public properties: LocalStorageService) { }

  ngOnInit(): void {
    this.getUsers(-1);
    this.organizations = this.config.organizations;
    this.initSelectedColumns();
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

  changeOwner(){
    const dialogRef = this.dialog.open(ChangeOwnerDialogComponent, {
      data: this.users,
      width: '680px'
     });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
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

  deleteUser(user: User) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.deleteUser.title')),
      message: String(this.translator.instant('dialog.deleteUser.message', { name: user.name })),
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
        this.api.deleteUser(user).subscribe((response: any) => {
          if (response['response'].errors) {
            this.ui.showErrorDialogFromObject(response['response'].errors);
            return;
          }
          this.getUsers(-1);
        });
      }
    });
  }

  // resizable columns
  setColumns() {
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumns() {
    const prop = this.properties.getStringProperty('adminColumns');
    if (prop) {
      Object.assign(this.selectedColumns, JSON.parse(prop));
    }
    this.setColumns();
  }

  getColumnWidth(field: string) {
    const el = this.selectedColumns.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizes(e: any, field?: string) {
    const el = this.selectedColumns.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.properties.setStringProperty('adminColumns', JSON.stringify(this.selectedColumns));
  }
  // end

}
