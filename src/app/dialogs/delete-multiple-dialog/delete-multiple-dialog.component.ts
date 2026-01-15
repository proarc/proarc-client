import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings } from '../../shared/user-settings';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-delete-multiple-dialog',
  imports: [TranslateModule, MatDialogModule,
    CdkDrag, CdkDragHandle, MatIconModule, MatInputModule,
    MatButtonModule, MatTooltipModule, MatCardModule, FormsModule,
    MatFormFieldModule],
  templateUrl: './delete-multiple-dialog.component.html',
  styleUrl: './delete-multiple-dialog.component.scss'
})
export class DeleteMultipleDialogComponent {

  pids: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteMultipleDialogComponent>,
    private api: ApiService,
    private config: Configuration,
    private ui: UIService,
    public settings: UserSettings) { }

    close(hierarchy: boolean) {
      this.dialogRef.close({
        hierarchy: hierarchy,
        pids: this.pids.split('\n')
      })
    }

}
