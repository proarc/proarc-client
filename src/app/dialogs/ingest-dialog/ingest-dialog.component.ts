
import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Batch } from '../../model/batch.model';
import { ApiService } from '../../services/api.service';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule
  ],
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
