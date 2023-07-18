import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  @ViewChild('name') name: ElementRef;
  @ViewChild('surname') surname: ElementRef;
  @ViewChild('password') password: ElementRef;

  user: User;
  roles = ['user', 'admin', 'superAdmin'];
  organizations: string[];

  constructor(
    private translator: TranslateService,
    private api: ApiService,
    private ui: UIService,
    private config: ConfigService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newUser();
    this.organizations = this.config.organizations;
  }


  newUser() {
    const newUser: User = User.fromJson({name: '', role: 'user', userId: -1});
    this.user = newUser;
  }

  setControleFieldTimeout(selectedFiled: any) {
    selectedFiled.nativeElement.focus();
    setTimeout(() => {selectedFiled.nativeElement.blur();}, 5);
    setTimeout(() => {selectedFiled.nativeElement.focus();}, 50);
  }


  saveUser() {
    if (!this.user.name ) {
      this.setControleFieldTimeout(this.name);
      return;
    }

    if (!this.user.password && this.user.userId === -1 ) {
      this.setControleFieldTimeout(this.password);
      return;
    }

    if (!this.user.surname ) {
      this.setControleFieldTimeout(this.surname);
      return;
    }

    this.api.newUser(this.user).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return; 
      }
      const user: User =  User.fromJson(response['response']['data'][0]);
      this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.addNewUser.success')));
      this.router.navigate(['/admin']);
    });
  }
}
