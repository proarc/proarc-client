import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Translator } from 'angular-translator';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Injectable()
export class UIService {

  dialogRef: MatDialogRef<AlertDialogComponent>;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translator: Translator
  ) {
  }

  public showErrorDialog(data) {
    this.dialogRef = this.dialog.open(AlertDialogComponent, {    
         data
    });
  }
  
  public confirmed(): Observable<any> {
    
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
        return res;
      }
    ));
  }


  showInfo(code: string, duration: number = 2000) {
    this.snackBar.open(String(this.translator.instant(code)), '', { duration: duration });
  }

  showInfoSnackBar(message: string, duration: number = 2000) {
    this.snackBar.open(message, 'OK', { duration: duration, panelClass: 'app-snackbar-success' });
  }

  showErrorSnackBar(message: string, duration: number = 4000) {
    //this.snackBar.open(message, 'Chyba', { duration: duration, verticalPosition: 'top', panelClass: 'app-snackbar-error' });
    
    const data = {
      type: 'error',
      title: 'Chyba',
      message: [message]
    };
    this.showErrorDialog(data);

  }

  showErrorSnackBarFromObject(errors: any) {
    // response.errors.mods[0].errorMessage
    const keys = Object.keys(errors);
    let message = [];
    keys.forEach(k => {
      if (Array.isArray(errors[k])) {
        errors[k].forEach(e => {
          message.push(e.errorMessage);
        });
      } else if (typeof errors[k] === 'string') {
        message.push(errors[k]);
      }
    });

    //this.showErrorSnackBar(message);

    const data = {
      type: 'error',
      title: 'Chyba',
      message
    };
    this.showErrorDialog(data);


  }

}
