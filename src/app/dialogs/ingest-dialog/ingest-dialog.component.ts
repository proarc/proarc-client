
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';

@Component({
  templateUrl: './ingest-dialog.component.html',
  styleUrls: ['./ingest-dialog.component.scss']
})
export class IngestDialogComponent implements OnInit {

  state = 'loading';

  private batchId;
  private parentPid;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<IngestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.batchId = data.batch;
      this.parentPid = data.parent;
      dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.state = 'loading';
    this.ingest();
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
    this.state = 'success';
  }

}
