

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Batch } from '../../model/batch.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';

@Component({
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule, MatProgressBarModule],
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit, OnDestroy {

  state = 'loading';
  failureMessage: string = '';

  public count = 0;
  public done = 0;

  private timer: any;
  private batchId;

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.batchId = data.batch;
  }

  ngOnInit() {
    this.state = 'loading';
    this.timer = setInterval(() => {
      this.onTick();
    }, 1000);
  }

  onTick() {
    //this.api.getImportBatchStatus(this.batchId).subscribe((response: any) => {
    this.api.getImportBatchStatusOld(this.batchId).subscribe((response: any) => {

      if (response.response.errors) {
        this.api.getImportBatchStatus(this.batchId).subscribe((response: any) => {
          const batch2: Batch = Batch.fromJson(response['response'].data[0])
          this.state = 'failure';
          this.failureMessage = batch2.failure;
          return;
        });
        this.state = 'error';
        //this.ui.showErrorDialogFromObject(response.response.errors);
        clearInterval(this.timer);
        this.state = 'failure';
        return;
      }

      if (response['response'].data.length > 0) {

        const batch: Batch = Batch.fromJson(response['response'].data[0])

        if (batch.state === 'LOADING_FAILED') {
          clearInterval(this.timer);
          this.state = 'failure';
          this.failureMessage = batch.failure;
          return;
        }
      }

      const status: [number, number] = Batch.statusFromJson(response['response']);

      this.done = status[0];
      this.count = status[1];
      if (this.done === this.count) {
        this.onLoaded();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private onLoaded() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.state = 'success';
  }


}
