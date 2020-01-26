
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit, OnDestroy {

  public count = 0;
  public done = 0;

  private timer;
  private batchId;
  private parentPid;
  private error = false;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.batchId = data.batch;
      this.parentPid = data.parent;
  }

  ngOnInit() {
    this.timer= setInterval(() => {
      this.onTick();
    }, 1000);
  }

  onTick() {
    this.api.getImportBatchStatus(this.batchId).subscribe(
      (status: [number, number]) => {
      this.done = status[0];
      this.count = status[1];
      if (this.done === this.count) {
        this.onLoaded();
      }
    },
    (error) => {
        clearInterval(this.timer);
        this.dialogRef.close('failure');
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onLoaded() {
    clearInterval(this.timer);
    this.api.setParentForBatch(this.batchId, this.parentPid).subscribe((batch: Batch) => {
      console.log('setting parent done', batch);
      this.api.ingestBatch(this.batchId, this.parentPid).subscribe((batch: Batch) => {
        console.log('ingest batch done', batch);
        this.dialogRef.close('success');
      },
      (error) => {
        console.log('ingest batch error', error);
      });
    },
    (error) => {
      console.log('sitting parent error', error);
    });

    // this.dialogRef.close('success');
  }


}
