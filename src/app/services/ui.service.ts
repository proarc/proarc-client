import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Injectable()
export class UIService {

  private refreshSubject = new Subject<boolean>();
  public refresh : Observable<boolean> = this.refreshSubject.asObservable();

  dialogRef: MatDialogRef<AlertDialogComponent>;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translator: TranslateService
  ) {
  }

  public shoulRefresh() {
    this.refreshSubject.next(true);
  }

  public showErrorDialog(data: { type: string; title: string; message: any[] | string[]; }) {
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

    //this.showErrorSnackBar(message);

    const data = {
      type: 'error',
      title: 'Chyba',
      message
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

}
