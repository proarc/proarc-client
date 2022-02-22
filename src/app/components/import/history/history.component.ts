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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  queue: Batch[];

  selectedBatch: Batch;
  
  view: string;

  private timer;
  autoRefresh = false;

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
    this.changeView('overview');
    // this.timer= setInterval(() => {
    //   this.updateLoadingBatchesProgress();
    // }, 5000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  setRefresh() {
    if (this.autoRefresh) {
      this.timer= setInterval(() => {
        this.reload();
      }, 10000);
      this.reload();
    } else {
      clearInterval(this.timer);
    }
  }

  selectBatch(batch: Batch) {
    this.selectedBatch = batch;
  }

  openBatch(batch: Batch) {
    if (batch.state === 'INGESTED' && batch.parentPid) {
      this.router.navigate(['/document', batch.parentPid]);
    } else if (batch.state === 'LOADED') {
      this.router.navigate(['/import', 'edit', this.selectedBatch.id]);
    }
  }

  changeView(view: string) {
    if (view == 'overview') {
      this.view = 'overview';
      this.reloadBatches();
    } else if (view == 'queue') {
      this.view = 'queue';
      this.reloadQueue();
    }
  }

  reload() {
    if (this.view == 'overview') {
      this.reloadBatches();
    } else if (this.view == 'queue') {
      this.reloadQueue()
    }
  }

  reloadBatches() {
    this.selectedBatch = null;
    this.state = 'loading';
    this.api.getImportBatches(this.selectedState).subscribe((resp: any) => {
      console.log(resp);
      this.batches = resp.data.map(d => Batch.fromJson(d));
      this.resultCount = resp.totalRows;
      this.state = 'success';
      this.updateLoadingBatchesProgress(this.batches);
    });
  }

  reloadQueue() {
    this.selectedBatch = null;
    this.state = 'loading';
    this.api.getBatchQueue().subscribe((batches: Batch[]) => {
      this.queue = batches;
      this.state = 'success';
      this.updateLoadingBatchesProgress(this.queue);
    }, error => {
      this.api.getImportBatches('LOADING').subscribe((batches: Batch[]) => {
        this.queue = batches;
        this.state = 'success';
        this.updateLoadingBatchesProgress(this.queue);
      });
    });
  }

  updateLoadingBatchesProgress(batches: Batch[]) {
    if (!batches) {
      return;
    }
    for (const batch of batches) {
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
    this.router.navigate(['/import', 'edit', this.selectedBatch.id]);
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
          this.reloadBatches();
        }
      });
  }

  private reloadBatch(profile: Profile) {
    if (!this.selectedBatch || !profile) {
      return;
    }
    this.api.reloadBatch(this.selectedBatch.id, profile.id).subscribe((batch: Batch) => {
      const dialogRef = this.dialog.open(ImportDialogComponent, { data: {batch: batch.id }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
          if (result === 'open') {
            this.onIngestBatch();
          } else {
            this.reloadBatches();
          }
          
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
    this.reloadBatches();
  }

  onPageChanged(page) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  batchProgress(batch: Batch): string {
    return this.progressMap[batch.id];
  }

}
