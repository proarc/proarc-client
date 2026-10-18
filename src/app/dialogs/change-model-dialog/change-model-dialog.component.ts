
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { ConversionResultService } from '../../services/conversion-result.service';
import { changeModelProgress } from '../../shared/change-model-progress';

@Component({
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, MatCardModule],
  selector: 'app-change-model-dialog',
  templateUrl: './change-model-dialog.component.html',
  styleUrls: ['./change-model-dialog.component.scss']
})
export class ChangeModelDialogComponent implements OnInit {

  inProgress = false;

  destinations: any[] = [];

  constructor(
    private api: ApiService,
    private ui: UIService,
    private conversionResult: ConversionResultService,
    private translator: TranslateService,
    public dialogRef: MatDialogRef<ChangeModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

  }

  change(dest: any) {
    if (this.inProgress) return;
    this.inProgress = true;
    this.api.changeModel(this.data.pid, this.data.model, dest.apiPoint).subscribe({
      next: (response: any) => {
        const result = response?.response;
        const progress = changeModelProgress(response);
        const title = String(this.translator.instant('dialog.changeModel.title'));
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
          const message = String(this.translator.instant('snackbar.changeModel.success', {
            value: this.translator.instant('model.model:' + dest.model)
          }));
          this.conversionResult.showAfterClosing(this.dialogRef, {
            title, success: true, messages: [message], response
          });
        }
      },
      error: (error: any) => {
        this.conversionResult.showAfterClosing(this.dialogRef, {
          title: String(this.translator.instant('dialog.changeModel.title')),
          success: false,
          messages: [error?.message || String(error)],
          response: error?.error ?? { message: error?.message || String(error) }
        });
      }
    });
  }

}
