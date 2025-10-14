import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeOwnerDialogComponent } from './change-owner-dialog/change-owner-dialog.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { User } from '../../model/user.model';
import { ResizecolDirective } from '../../resizecol.directive';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { Configuration, TableColumn } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Utils } from '../../utils/utils';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

@Component({
  imports: [TranslateModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatInputModule, MatTooltipModule, MatCheckboxModule, MatFormFieldModule, MatPaginatorModule, MatTableModule, MatSortModule, ResizecolDirective],
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
  organizations: string[];

  public selectedColumns = [
    { field: 'name', selected: true, width: 100 },
    { field: 'forename', selected: true, width: 100 },
    { field: 'surname', selected: true, width: 100 },
    { field: 'email', selected: true, width: 100 },
    { field: 'organization', selected: true, width: 100 },
    { field: 'home', selected: true, width: 100 },
    // { field: 'changeModelFunction', selected: true, width: 100},
    // { field: 'changePagesFunction', selected: true, width: 100},
    // { field: 'lockObjectFunction', selected: true, width: 100},
    // { field: 'unlockObjectFunction', selected: true, width: 100},
    // { field: 'importToCatalogFunction', selected: true, width: 100},
    // { field: 'czidloFunction', selected: true, width: 100},
    // { field: 'deleteActionFunction', selected: true, width: 100},
    // { field: 'changeObjectsOwnerFunction', selected: true, width: 100},
    // { field: 'prepareBatchFunction', selected: true, width: 100},
    // { field: 'allObjectsFunction', selected: true, width: 100},
    // { field: 'importToProdFunction', selected: true, width: 100},
    // { field: 'deviceFunction', selected: true, width: 100},
    // { field: 'createUserFunction', selected: true, width: 100},
    // { field: 'updateUserFunction', selected: true, width: 100},
    // { field: 'deleteUserFunction', selected: true, width: 100},
    // { field: 'solrFunction', selected: true, width: 100},
    // { field: 'sysAdminFunction', selected: true, width: 100},
    // { field: 'wfCreateJobFunction', selected: true, width: 100},
    // { field: 'wfDeleteJobFunction', selected: true, width: 100},
    { field: 'action', selected: true, width: 100 }
  ];

  displayedColumns: string[] = ['name', 'forename', 'surname', 'email', 'organization', 'home',
    // 'changeModelFunction', 'changePagesFunction', 'lockObjectFunction', 'unlockObjectFunction',
    // 'importToCatalogFunction', 'czidloFunction', 'deleteActionFunction', 'changeObjectsOwnerFunction', 'prepareBatchFunction',
    // 'allObjectsFunction', 'importToProdFunction', 'deviceFunction', 'createUserFunction', 'updateUserFunction', 'deleteUserFunction',
    // 'solrFunction', 'sysAdminFunction', 'wfCreateJobFunction', 'wfDeleteJobFunction',
    'action'];

  constructor(
    private translator: TranslateService,
    private config: Configuration,
    public auth: AuthService,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService,
    public settings: UserSettings,
    public settingsService: UserSettingsService) { }

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
    const newUser: User = User.fromJson({name: 'user_name', userId: -1});
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



  initSelectedColumns() {
    const colsSettings: TableColumn[] = Utils.clone(this.settings['adminColumns']);
    this.selectedColumns = colsSettings.filter(c => c.selected);
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field);
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
    const el = this.settings['adminColumns'].find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }

    this.settingsService.save();
  }
  // end

}
