import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { UIService } from '../../services/ui.service';
import { changeModelProgress } from '../../shared/change-model-progress';

export interface ConversionResult {
  title: string;
  success: boolean;
  messages: string[];
  response: unknown;
}

@Component({
  imports: [TranslateModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule],
  templateUrl: './conversion-result-dialog.component.html',
  styleUrls: ['./conversion-result-dialog.component.scss']
})
export class ConversionResultDialogComponent {
  readonly progress;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConversionResult,
    private ui: UIService
  ) {
    this.progress = changeModelProgress(data.response);
  }

  copyPids(pids: string[]) {
    this.ui.copyTextToClipboard(pids.join('\n'));
  }
}
