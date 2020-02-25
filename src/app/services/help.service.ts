import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HelpDialogComponent } from '../dialogs/help-dialog/help-dialog.component';

@Injectable()
export class HelpService {

  constructor(private dialog: MatDialog) {
  }

  showForField(field: string) {
    this.dialog.open(HelpDialogComponent, { data: "editor.help." + field });

  }

}
