

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, exhaustMap, of, Subscription, timer } from 'rxjs';
import { Batch } from '../../model/batch.model';
import { ApiService } from '../../services/api.service';

@Component({
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './ingest-dialog.component.html',
  styleUrls: ['./ingest-dialog.component.scss']
})
export class IngestDialogComponent implements OnInit, OnDestroy {

  state = 'loading';

  private batchId;
  private parentPid;
  private statusSubscription?: Subscription;

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
      this.api.ingestBatch(this.batchId, this.parentPid).subscribe((response: any) => {
        const batch = response?.response?.data?.[0];
        if (!this.updateState(batch?.state)) {
          this.waitForIngestResult();
        }
      },
      (error) => {
        console.log('ingest batch error', error);
        this.waitForIngestResult();
      });
    },
    (error) => {
      console.log('sitting parent error', error);
      this.state = 'failure';
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription?.unsubscribe();
  }

  private waitForIngestResult() {
    if (this.statusSubscription) {
      return;
    }

    this.statusSubscription = timer(0, 2000).pipe(
      exhaustMap(() => this.api.getImportBatch(this.batchId).pipe(
        catchError((error) => {
          console.log('get ingest status error', error);
          return of(null);
        })
      ))
    ).subscribe((batch: Batch | null) => {
      if (batch && this.updateState(batch.state)) {
        this.statusSubscription?.unsubscribe();
      }
    });
  }

  private updateState(batchState?: string): boolean {
    if (batchState === 'INGESTED') {
      this.onIngested();
      return true;
    }
    if (batchState === 'INGESTING_FAILED') {
      this.state = 'failure';
      return true;
    }
    if (batchState && batchState !== 'INGESTING') {
      this.state = 'failure';
      return true;
    }
    return false;
  }

  private onIngested() {
    this.state = 'success';
  }

}
