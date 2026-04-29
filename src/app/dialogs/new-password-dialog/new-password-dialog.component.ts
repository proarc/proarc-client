
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { MatInputModule } from '@angular/material/input';
import { UserSettings } from '../../shared/user-settings';

@Component({
  standalone: true,
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, MatProgressBarModule],
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
    private api: ApiService,
    public settings: UserSettings) { }

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
