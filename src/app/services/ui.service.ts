import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { UserSettings } from '../shared/user-settings';

@Injectable()
export class UIService {


  // public toolbarTooltipPosition: any = 'above';

  dialogRef: MatDialogRef<AlertDialogComponent>;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translator: TranslateService,
    private clipboard: Clipboard,
    public settings: UserSettings
  ) {
  }

  public showErrorDialog(data: { type: string; title: string; message: any[] | string[]; }) {
    return this.dialog.open(AlertDialogComponent, {
         data,
         width: '600px',
         panelClass: ['app-dialog-alert', 'app-form-view-' + this.settings.appearance]
    });
  }

  public showInfoDialog(message: string, duration: number = 2000) {
    const data = {
      type: 'success',
      title: 'Info',
      message: [message]
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
         data,
         width: '400px',
         panelClass: ['app-dialog-alert', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
         dialogRef.close();
      }, duration)
    })
  }

  public confirmed(): Observable<any> {

    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
        return res;
      }
    ));
  }


  showInfo(code: string, duration: number = 2000) {
    this.snackBar.open(String(this.translator.instant(code)), '', { duration: duration, verticalPosition: 'top'});
  }

  showInfoSnackBar(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'OK', { duration: duration, panelClass: 'app-snackbar-success', verticalPosition: 'top' });
  }

  showErrorSnackBar(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'Chyba', { duration: duration, panelClass: 'app-snackbar-error', verticalPosition: 'top' });

   /*  const data = {
      type: 'error',
      title: 'Chyba',
      message: [message]
    };
    this.showErrorDialog(data); */

  }

  showErrorDialogFromObject(errors: any) {
    // response.errors.mods[0].errorMessage
    const keys = Object.keys(errors);
    let message: any[] = [];
    keys.forEach(k => {
      if (Array.isArray(errors[k])) {
        errors[k].forEach((e: { errorMessage: any; }) => {
          message.push(e.errorMessage);
        });
      } else if (typeof errors[k] === 'string') {
        message.push(errors[k]);
      }
    });

    const data = {
      type: 'error',
      title: String(this.translator.instant('desc.error')),
      message
    };
    return this.showErrorDialog(data);
  }

  showErrorDialogFromString(message: String) {
    const data = {
      type: 'error',
      title: String(this.translator.instant('desc.error')),
      message: [message]
    };
    this.showErrorDialog(data);
  }

  extractErrors(errors: any): {key: string, msg: string}[] {
    const keys = Object.keys(errors);
    const messages: {key: string, msg: string}[] = [];
    keys.forEach(k => {
      if (Array.isArray(errors[k])) {
        errors[k].forEach((e: { errorMessage: any; }) => {
          messages.push({key: k, msg: e.errorMessage});
        });
      } else if (typeof errors[k] === 'string') {
        messages.push({key: k, msg: errors[k]});
      }
    });
    return messages;
  }

  extractErrorsAsString(errors: any): string {
    const keys = Object.keys(errors);
    const messages: {key: string, msg: string}[] = [];
    keys.forEach(k => {
      if (Array.isArray(errors[k])) {
        errors[k].forEach((e: { errorMessage: any; }) => {
          messages.push({key: k, msg: e.errorMessage});
        });
      } else if (typeof errors[k] === 'string') {
        messages.push({key: k, msg: errors[k]});
      }
    });
    return messages.map(m => m.key + ': ' + m.msg).join('\n');
  }

  copyTextToClipboard(val: string) {
    this.clipboard.copy(val);
    this.showInfoSnackBar(this.translator.instant('snackbar.copyTextToClipboard.success'));
  }

}
