
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UIService } from 'src/app/services/ui.service';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-new-password-dialog',
  templateUrl: './new-password-dialog.component.html',
  styleUrls: ['./new-password-dialog.component.scss']
})
export class NewPasswordDialogComponent implements OnInit {

  state = 'none';

  password1: string;
  password2: string;
  error: string;

  constructor(
    public dialogRef: MatDialogRef<NewPasswordDialogComponent>,
    private auth: AuthService,
    private ui: UIService,
    private translator: Translator,
    private api: ApiService) { }

  ngOnInit() {
    this.password1 = '';
    this.password2 = '';
    this.error = '';
  }


  validate(): boolean {
    return !!this.password1 && !!this.password2;
  }

  onUpdate() {
    if (this.password1 != this.password2) {
      this.error = 'settings.profile.new_password.error_mismatch';
      return;
    }
    if (this.password1.length < 6) {
      this.error = 'settings.profile.new_password.error_short';
      return;
    }
    this.state = 'saving';
    this.api.editUserPassword(this.auth.getUser(), this.password1).subscribe(()=> {
      this.ui.showInfoSnackBar(String(this.translator.instant('settings.profile.new_password.updated')));
      this.dialogRef.close();
    });
  }

}
