import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UIService } from 'src/app/services/ui.service';
import { ConfigService } from 'src/app/services/config.service';

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
  selectedUser: any;

  roles = ['user', 'admin', 'superAdmin'];
  organizations: string[];

  constructor(
    private api: ApiService,        
    private translator: TranslateService,
    private route: ActivatedRoute,
    private ui: UIService,
    private config: ConfigService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getUser();
    });
    this.organizations = this.config.organizations;
  }

  private getUser() {
    this.api.getUserDetail(this.id).subscribe((user: User) => {
      this.selectedUser = user;
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
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.editUser.success')));
        this.router.navigate(['/admin']);
      });
    }
  }
  
}
