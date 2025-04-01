import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { User } from '../../../model/user.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { Configuration } from '../../../shared/configuration';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule, FlexLayoutModule,
    MatIconModule, MatButtonModule, MatProgressBarModule, MatCardModule, 
    MatInputModule, MatTooltipModule, MatCheckboxModule, MatFormFieldModule,
    MatSelectModule
  ],
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
    private config: Configuration,
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
