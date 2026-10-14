import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Highlight } from 'ngx-highlightjs';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-software-preview-dialog',
  standalone: true,
  imports: [TranslateModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, Highlight],
  templateUrl: './software-preview-dialog.component.html',
  styleUrl: './software-preview-dialog.component.scss'
})
export class SoftwarePreviewDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; xml: string },
    private ui: UIService
  ) {}

  copy(): void {
    this.ui.copyTextToClipboard(this.data.xml);
  }
}
