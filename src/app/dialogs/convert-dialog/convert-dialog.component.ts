
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {UIService} from '../../services/ui.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';
import { ConversionResultService } from '../../services/conversion-result.service';
import { changeModelProgress } from '../../shared/change-model-progress';

@Component({
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, MatCardModule],
  templateUrl: './convert-dialog.component.html',
  styleUrls: ['./convert-dialog.component.scss']
})
export class ConvertDialogComponent implements OnInit {

  inProgress = false;

  constructor(
    private api: ApiService,
    private ui: UIService,
    private conversionResult: ConversionResultService,
    private translator: TranslateService,
    public dialogRef: MatDialogRef<ConvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.inProgress = false;
  }

  convert(type: string) {
    if (this.inProgress) return;
    this.inProgress = true;
    this.api.convertPages(this.data.pid, this.data.model, type).subscribe({
      next: (response: any) => {
        const result = response?.response;
        const progress = changeModelProgress(response);
        const title = String(this.translator.instant('dialog.convertPages.title'));
        if (result?.errors) {
          const messages = this.ui.extractErrors(result.errors).map(error => error.msg);
          this.conversionResult.showAfterClosing(this.dialogRef, {
            title, success: false, messages: messages.length ? messages : [String(this.translator.instant('desc.error'))], response
          });
        } else if (result?.status !== 0 && !progress) {
          this.conversionResult.showAfterClosing(this.dialogRef, {
            title, success: false, messages: [result?.errorMessage ||
              (typeof result?.data === 'string' ? result.data : String(this.translator.instant('desc.error')))], response
          });
        } else if (progress?.validation || result?.data?.[0]?.validation) {
          const messages = [progress?.validation || result.data[0].validation];
          this.conversionResult.showAfterClosing(this.dialogRef, { title, success: false, messages, response });
        } else {
          this.conversionResult.showAfterClosing(this.dialogRef, {
            title, success: true,
            messages: [String(this.translator.instant('snackbar.convertPages.success'))],
            response
          });
        }
      },
      error: (error: any) => {
        this.conversionResult.showAfterClosing(this.dialogRef, {
          title: String(this.translator.instant('dialog.convertPages.title')),
          success: false,
          messages: [error?.message || String(error)],
          response: error?.error ?? { message: error?.message || String(error) }
        });
      }
    });
  }

}
