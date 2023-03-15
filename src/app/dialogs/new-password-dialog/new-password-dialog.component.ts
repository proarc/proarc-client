
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UIService } from 'src/app/services/ui.service';
import { TranslateService } from '@ngx-translate/core';

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
    private translator: TranslateService,
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
      this.error = 'snackbar.settings.profile.error.mismatch';
      return;
    }
    if (this.password1.length < 6) {
      this.error = 'snackbar.settings.profile.error.short';
      return;
    }
    this.state = 'saving';
    this.api.editUserPassword(this.auth.getUser(), this.password1).subscribe(()=> {
      this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.settings.profile.updated')));
      this.dialogRef.close();
    });
  }

}
