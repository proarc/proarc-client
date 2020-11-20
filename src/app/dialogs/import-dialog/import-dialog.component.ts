
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

  state = 'loading';


  public count = 0;
  public done = 0;

  private timer;
  private batchId;
  private parentPid;
  private ingestOnly: boolean;
  private error = false;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.batchId = data.batch;
      this.parentPid = data.parent;
      this.ingestOnly = !!data.ingestOnly;
}

  ngOnInit() {
    this.state = 'loading';
    if (this.ingestOnly) {
      this.ingest();
    } else {
      this.timer= setInterval(() => {
        this.onTick();
      }, 1000);
    }
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
        this.state = 'failure';
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
    if (this.parentPid) {
      this.ingest();
    } else {
      this.state = 'loaded';
    }
  }

  private ingest() {
    this.api.setParentForBatch(this.batchId, this.parentPid).subscribe((batch: Batch) => {
      this.api.ingestBatch(this.batchId, this.parentPid).subscribe((batch: Batch) => {
        this.onIngested();
      },
      (error) => {
        console.log('ingest batch error', error);
        this.state = 'failure';
      });
    },
    (error) => {
      console.log('sitting parent error', error);
      this.state = 'failure';
    });
  }

  private onIngested() {
    this.state = 'ingested';
  }

}
