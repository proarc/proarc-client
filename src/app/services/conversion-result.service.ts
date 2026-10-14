import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { take } from 'rxjs';
import { UserSettings } from '../shared/user-settings';
import { ConversionResult, ConversionResultDialogComponent } from '../dialogs/conversion-result-dialog/conversion-result-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConversionResultService {
  constructor(private dialog: MatDialog, private settings: UserSettings) {}

  showAfterClosing(source: MatDialogRef<unknown>, result: ConversionResult) {
    const showResult = () => this.dialog.open(ConversionResultDialogComponent, {
      data: result,
      width: '700px',
      panelClass: ['app-form-view-' + this.settings.appearance]
    });

    if (source.getState() === MatDialogState.CLOSED) {
      showResult();
    } else {
      source.afterClosed().pipe(take(1)).subscribe(showResult);
      source.close({ status: result.success ? 'ok' : 'failure', messageShown: true });
    }
  }
}
