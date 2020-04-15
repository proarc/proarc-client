import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';
import { User } from 'src/app/model/user.model';
import { MatDialog } from '@angular/material';
import { Translator } from 'angular-translator';
import { LogDialogComponent } from 'src/app/dialogs/log-dialog/log-dialog.component';
import { Router } from '@angular/router';
import { ReloadBatchDialogComponent } from 'src/app/dialogs/reload-batch-dialog/reload-batch-dialog.component';
import { Profile } from 'src/app/model/profile.model';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  state = 'none';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 200;

  selectedState = 'ALL';

  users: User[];
  batches: Batch[];
  selectedBatch: Batch;
  

  private timer;


  private progressMap = {};

  batchStates = [
    'ALL',
    'LOADING',
    'LOADING_FAILED',
    'LOADED',
    'INGESTING',
    'INGESTING_FAILED',
    'INGESTED'
  ];

  constructor(private api: ApiService, 
              private dialog: MatDialog, 
              private router: Router,
              private translator: Translator) { }

  ngOnInit() {
    this.reload();
    // this.timer= setInterval(() => {
    //   this.updateLoadingBatchesProgress();
    // }, 5000);
  }

  ngOnDestroy() {
    // if (this.timer) {
    //   clearInterval(this.timer);
    // }
  }

  selectBatch(batch: Batch) {
    this.selectedBatch = batch;
  }

  reload() {
    this.selectedBatch = null;
    this.state = 'loading';
    this.api.getImportBatches(this.selectedState).subscribe((batches: Batch[]) => {
      this.batches = batches;
      this.state = 'success';
      this.updateLoadingBatchesProgress();
    });
  }


  updateLoadingBatchesProgress() {
    if (!this.batches) {
      return;
    }
    for (const batch of this.batches) {
      if (batch.isLoading()) {
        this.api.getImportBatchStatus(batch.id).subscribe(
          (status: [number, number]) => {
            const done = status[0];
            const count = status[1];
            if (count === 0) {
              this.progressMap[batch.id] = '?';
            } else {
              this.progressMap[batch.id] = Math.round(( done * 1.0 / count) * 100) + '%';
            }
        },
        (error) => {
            this.progressMap[batch.id] = '!';
        });
      }
    }
  }

  onReloadBatch() {
    const dialogRef = this.dialog.open(ReloadBatchDialogComponent, { data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.profile) {
        this.reloadBatch(result.profile);
      }
    });   
  }

  onIngestBatch() {
    if (!this.selectedBatch) {
      return;
    }
    if (this.selectedBatch.profile === 'profile.chronicle' && this.selectedBatch.parentPid)  {
      this.ingestBatch(this.selectedBatch.parentPid);
      return;
    }
    const dialogRef = this.dialog.open(ParentDialogComponent, { data: { ingestOnly: true }});
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.pid) {
        this.ingestBatch(result.pid);
      }
    });
  }


  private ingestBatch(parentPid: string) {
    if (!this.selectedBatch) {
      return;
    }
    const dialogRef = this.dialog.open(ImportDialogComponent, { data: {batch: this.selectedBatch.id, parent: parentPid, ingestOnly: true }});
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'open') {
          this.router.navigate(['/document', parentPid]);
        } else {
          this.reload();
        }
      });
  }

  private reloadBatch(profile: Profile) {
    if (!this.selectedBatch || !profile) {
      return;
    }
    this.api.reloadBatch(this.selectedBatch.id, profile.id).subscribe((batch: Batch) => {
      const dialogRef = this.dialog.open(ImportDialogComponent, { data: {batch: batch.id, parent: null }});
      dialogRef.afterClosed().subscribe(result => {
          this.reload();
      });
    });
  }

  onShowLog(batch: Batch) {
    const data = {
      content: batch.failure
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

  onEditBatchObject() {
    this.router.navigate(['/document', this.selectedBatch.parentPid]);
  }

  onStateChanged() {
    this.reload();
  }


  onPageChanged(page) {
    // this.pageIndex = page.pageIndex;
    // this.reload();
  }

  batchProgress(batch: Batch): string {
    return this.progressMap[batch.id];
  }


}
