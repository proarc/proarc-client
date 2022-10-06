import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';
import { User } from 'src/app/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LogDialogComponent } from 'src/app/dialogs/log-dialog/log-dialog.component';
import { Router } from '@angular/router';
import { ReloadBatchDialogComponent } from 'src/app/dialogs/reload-batch-dialog/reload-batch-dialog.component';
import { Profile } from 'src/app/model/profile.model';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { DatePipe } from '@angular/common';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  state = 'none';

  pageIndex = 0;
  pageSize = 20;
  resultCount = 200;

  selectedState = 'ALL';

  users: User[];
  batches: Batch[];
  queue: Batch[];

  selectedBatch: Batch;

  view: string;

  private timer: any;
  autoRefresh = false;

  private progressMap: any = {};

  description: string;
  user: string;
  createFrom: Date;
  createTo: Date;
  modifiedFrom: Date;
  modifiedTo: Date;

  batchStates = [
    'ALL',
    'LOADING',
    'LOADING_FAILED',
    'LOADED',
    'INGESTING',
    'INGESTING_FAILED',
    'INGESTED'
  ];

  constructor(
    private datePipe: DatePipe,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    private router: Router,
    private translator: TranslateService) { }

  ngOnInit() {
    this.changeView('overview');
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
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
      this.timer = setInterval(() => {
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
    
    this.pageIndex = 0;
    if (view == 'overview') {
      this.view = 'overview';
      this.reloadBatches();
    } else if (view == 'queue') {
      this.view = 'queue';
      this.reloadQueue();
    }
  }

  reload() {
    this.pageIndex = 0;
    if (this.view == 'overview') {
      this.reloadBatches();
    } else if (this.view == 'queue') {
      this.reloadQueue()
    }
  }

  reloadBatches() {
    this.selectedBatch = null;
    this.state = 'loading';
    const start = this.pageIndex * this.pageSize;
    let params: any = {
      _sortBy: '-timestamp',
      _startRow: start,
      _endRow: start + this.pageSize,
      _size: this.pageSize
    };
    if (this.selectedState && this.selectedState !== 'ALL') {
      params['state'] = this.selectedState;
    };

    if (this.description) {
      params['description'] = this.description;
    }

    if (this.user) {
      params['userId'] = this.user;
    }

    if (this.createFrom) {
      params['createFrom'] = this.datePipe.transform(this.createFrom, 'yyyy-MM-dd');
    }

    if (this.createTo) {
      params['createTo'] = this.datePipe.transform(this.createTo, 'yyyy-MM-dd');
    }

    if (this.modifiedFrom) {
      params['modifiedFrom'] = this.datePipe.transform(this.modifiedFrom, 'yyyy-MM-dd');
    }

    if (this.modifiedTo) {
      params['modifiedTo'] = this.datePipe.transform(this.modifiedTo, 'yyyy-MM-dd');
    }
    // createFrom: 2022-05-01T10:36:00.000
    // createTo: 2022-06-03T10:36:00.000
    // modifiedTo modifiedTo


    this.api.getImportBatches(params).subscribe((resp: any) => {
      this.batches = resp.data.map((d: any) => Batch.fromJson(d));
      this.resultCount = resp.totalRows;
      this.state = 'success';
      this.updateLoadingBatchesProgress(this.batches);
    });
  }

  reloadQueue() {
    this.selectedBatch = null;
    this.state = 'loading';
    const start = this.pageIndex * this.pageSize;
    this.api.getBatchQueue().subscribe((batches: Batch[]) => {
      this.queue = batches;
      this.state = 'success';
      this.updateLoadingBatchesProgress(this.queue);
    }, error => {

      let params: any = {
        _sortBy: '-timestamp',
        _startRow: start,
        _endRow: start + this.pageSize,
        _size: this.pageSize,
        state: 'LOADING'
      };
      if (this.description) {
        params['description'] = this.description;
      }

      this.api.getImportBatches(params).subscribe((batches: Batch[]) => {
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
          (response: any) => {

            if (response.response.errors) {
              this.state = 'error';
              this.ui.showErrorSnackBarFromObject(response.response.errors);
              clearInterval(this.timer);
              this.state = 'failure';
              return;
            }
      
            const status: [number, number] = Batch.statusFromJson(response['response']);

            const done = status[0];
            const count = status[1];
            if (count === 0) {
              this.progressMap[batch.id] = '?';
            } else {
              this.progressMap[batch.id] = Math.round((done * 1.0 / count) * 100) + '%';
            }
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
    if (this.selectedBatch.profile === 'profile.chronicle' && this.selectedBatch.parentPid) {
      this.ingestBatch(this.selectedBatch.parentPid);
      return;
    }
    this.router.navigate(['/import', 'edit', this.selectedBatch.id]);
  }


  private ingestBatch(parentPid: string) {
    if (!this.selectedBatch) {
      return;
    }
    const dialogRef = this.dialog.open(ImportDialogComponent, { data: { batch: this.selectedBatch.id, parent: parentPid, ingestOnly: true } });
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
      const dialogRef = this.dialog.open(ImportDialogComponent, { data: { batch: batch.id } });
      dialogRef.afterClosed().subscribe(result => {

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
    this.pageIndex = 0;
    this.reloadBatches();
  }

  onPageChanged(page: any) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  batchProgress(batch: Batch): string {
    return this.progressMap[batch.id];
  }

  reIngest(b: Batch) {
    this.api.ingestBatch(b.id, b.parentPid).subscribe((response: any) => {

      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorSnackBarFromObject(response.response.errors);
        return;
      }

      const batch: Batch = Batch.fromJson(response['response']['data'][0]);

      const dialogRef = this.dialog.open(ImportDialogComponent, { data: { batch: batch.id } });
      dialogRef.afterClosed().subscribe(result => {

        if (result === 'open') {
          this.onIngestBatch();
        } else {
          this.reloadBatches();
        }

      });
    });
  }

}
