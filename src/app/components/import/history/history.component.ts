import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';
import { User } from 'src/app/model/user.model';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Translator } from 'angular-translator';
import { LogDialogComponent } from 'src/app/dialogs/log-dialog/log-dialog.component';
import { Router } from '@angular/router';

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


  reloadBatch() {
    
  }

  onReloadBatch() {
    this.translator.waitForTranslation().then(() => {
      const data: SimpleDialogData = {
        title: String(this.translator.instant('history.reload_dialog.title')),
        message: String(this.translator.instant('history.reload_dialog.message')),
        btn2: {
          label: String(this.translator.instant('common.no')),
          value: 'no',
          color: 'default'
        },
        btn1: { 
          label: String(this.translator.instant('common.yes')),
          value: 'yes',
          color: 'warn'
        }
      };
      const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.reloadBatch();
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

  onContinueWithBatch() {

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
