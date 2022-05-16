import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Translator } from 'angular-translator';

@Injectable()
export class UIService {


  constructor(
    private snackBar: MatSnackBar,
    private translator: Translator
  ) {
  }

  showInfo(code: string, duration: number = 2000) {
    this.snackBar.open(String(this.translator.instant(code)), '', { duration: duration });
  }

  showInfoSnackBar(message: string, duration: number = 2000) {
    this.snackBar.open(message, 'OK', { duration: duration, panelClass: 'app-snackbar-success' });
  }

  showErrorSnackBar(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Chyba', { duration: duration, verticalPosition: 'top' });
  }

  showErrorSnackBarFromObject(errors: any) {
    // response.errors.mods[0].errorMessage
    const keys = Object.keys(errors);
    let message = '';
    keys.forEach(k => {
      if (Array.isArray(errors[k])) {
        errors[k].forEach(e => {
          message += e.errorMessage + ' \n';
        });
      } else if (typeof errors[k] === 'string') {
        message += errors[k] + ' \n';
      }
    });
    this.showErrorSnackBar(message);
  }

}
