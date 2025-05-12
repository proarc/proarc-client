import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../../../model/user.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { Configuration } from '../../../shared/configuration';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule,
    MatIconModule, MatButtonModule, MatProgressBarModule, MatCardModule,
    MatInputModule, MatTooltipModule, MatCheckboxModule, MatFormFieldModule,
    MatSelectModule
  ],
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
    private config: Configuration,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newUser();
    this.organizations = this.config.organizations;
  }


  newUser() {
    const newUser: User = User.fromJson({name: null, role: 'user', userId: -1});
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
