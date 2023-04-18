import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';
import { User } from 'src/app/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LogDialogComponent } from 'src/app/dialogs/log-dialog/log-dialog.component';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ReloadBatchDialogComponent } from 'src/app/dialogs/reload-batch-dialog/reload-batch-dialog.component';
import { Profile } from 'src/app/model/profile.model';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { DatePipe } from '@angular/common';
import { UIService } from 'src/app/services/ui.service';
import {ConfigService} from '../../../services/config.service';

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

  selectedState = 'LOADED';

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
  priority: string;
  profile: string;
  createFrom: Date;
  createTo: Date;
  modifiedFrom: Date;
  modifiedTo: Date;

  displayedColumnsOverview: string[] = ['description', 'create',  'timestamp', 'state', 'profile', 'user', 'priority', 'actions'];
  displayedColumnsQueue: string[] = ['description', 'create',  'timestamp', 'state', 'pageCount', 'user' ];

  batchStates = [
    'ALL',
    'LOADING',
    'LOADING_FAILED',
    'LOADED',
    'INGESTING',
    'INGESTING_FAILED',
    'INGESTED',
    'STOPPED',
    'EXPORTING',
    'EXPORT_FAILED',
    'EXPORT_DONE',
    'REINDEXING',
    'REINDEX_FAILED',
    'REINDEX_DONE'
  ];

  priorities = [
    'lowest',
    'low',
    'medium',
    'high',
    'highest'
  ];

  profiles: string[];
    // 'profile.default',
    // 'profile.createObjectWithMetadata_import',
    // 'profile.default_archive_import',
    // 'profile.soundrecording_import',
    // 'profile.default_kramerius_import',
    // 'profile.stt_kramerius_import',
    // 'profile.ndk_monograph_kramerius_import',
    // 'profile.ndk_periodical_kramerius_import',
    // 'profile.chronicle',
    // 'profile.oldprint',
    // 'profile.ndk_full_import',
    // 'exportProfile.kramerius',
    // 'exportProfile.ndk',
    // 'exportProfile.archive',
    // 'exportProfile.desa',
    // 'exportProfile.cejsh',
    // 'exportProfile.crossref',
    // 'exportProfile.kwis',
    // // 'exportProfile.aleph',
    // 'internalProfile.reindex'
  // ]

  constructor(
    private datePipe: DatePipe,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    private translator: TranslateService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.processParams(p);
      this.loadData();
    });
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
    this.profiles = this.config.profiles;
    // this.timer= setInterval(() => {
    //   this.updateLoadingBatchesProgress();
    // }, 5000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  processParams(p: any) {
      this.view = p['view'] ? p['view'] : 'overview';
      this.selectedState = p['state'] ? p['state'] : 'LOADED';
      this.description = p['description'] ? p['description'] : null;
      // this.user = p['userId'] ? this.users.find(u => u.userId === p['userId']) : null;
      this.user = p['userId'] ? p['userId']  : null;
      this.priority= p['priority'] ? p['priority'] : null;
      this.profile = p['profile'] ? p['profile'] : null;
      this.createFrom = p['createFrom'] ? p['createFrom'] : null;
      this.createTo = p['createTo'] ? p['createTo'] : null;
      this.modifiedFrom = p['modifiedFrom'] ? p['modifiedFrom'] : null;
      this.modifiedTo = p['modifiedTo'] ? p['modifiedTo'] : null;
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
      this.router.navigate(['/repository', batch.parentPid]);
    } else if (batch.state === 'LOADED') {
      this.router.navigate(['/import', 'edit', this.selectedBatch.id]);
    }
  }

  loadData() {
    if (this.view == 'overview') {
      this.reloadBatches();
    } else if (this.view == 'queue') {
      this.reloadQueue();
    }
  }

  changeView(view: string) {
    this.pageIndex = 0;
    const q: any = {};
    q['view'] = view;
    q.page = null;
    this.router.navigate([], { queryParams: q, queryParamsHandling: 'merge' });
  }

  filter() {

    this.pageIndex = 0;
    const params: any = {};
    if (this.selectedState && this.selectedState !== 'ALL') {
      params['state'] = this.selectedState;
    } else {
      params['state'] = null;
    }

    if (this.description) {
      params['description'] = this.description;
    } else {
      params['description'] = null;
    }

    if (this.user) {
      params['userId'] = this.user;
    } else {
      params['userId'] = null;
    }

    if (this.priority) {
      params['priority'] = this.priority;
    } else {
      params['priority'] = null;
    }

    if (this.profile) {
      params['profile'] = this.profile;
    } else {
      params['profile'] = null;
    }

    if (this.createFrom) {
      params['createFrom'] = this.datePipe.transform(this.createFrom, 'yyyy-MM-dd');
    } else {
      params['createFrom'] = null;
    }


    if (this.createTo) {
      params['createTo'] = this.datePipe.transform(this.createTo, 'yyyy-MM-dd');
    } else {
      params['createTo'] = null;
    }

    if (this.modifiedFrom) {
      params['modifiedFrom'] = this.datePipe.transform(this.modifiedFrom, 'yyyy-MM-dd');
    } else {
      params['modifiedFrom'] = null;
    }

    if (this.modifiedTo) {
      params['modifiedTo'] = this.datePipe.transform(this.modifiedTo, 'yyyy-MM-dd');
    } else {
      params['statemodifiedTo'] = null;
    }

    params.page = null;
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

  reload() {
    // this.pageIndex = 0;
    this.loadData();
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

    if (this.priority) {
      params['priority'] = this.priority;
    }

    if (this.profile) {
      params['profile'] = this.profile;
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
        this.api.getImportBatchStatusOld(batch.id).subscribe(
          (response: any) => {

            if (response.response.errors) {
              this.state = 'error';
              this.ui.showErrorDialogFromObject(response.response.errors);
              clearInterval(this.timer);
              this.state = 'failure';
              return;
            }

            
        if (response['response'].status === -1) {
          this.ui.showErrorSnackBar(response['response'].data);
          // this.router.navigate(['/import/history']);
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
    const dialogRef = this.dialog.open(ReloadBatchDialogComponent, { 
      data: null,
      panelClass: 'app-dialog-reload-batch',
      width: '600px'
    });
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
    const dialogRef = this.dialog.open(ImportDialogComponent, { 
      data: { batch: this.selectedBatch.id, parent: parentPid, ingestOnly: true },
      panelClass: 'app-dialog-import',
      width: '600px'  
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'open') {
        this.router.navigate(['/repository', parentPid]);
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
      const dialogRef = this.dialog.open(ImportDialogComponent, { 
        data: { batch: batch.id },
        panelClass: 'app-dialog-import',
        width: '600px' 
      });
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
    this.router.navigate(['/repository', this.selectedBatch.parentPid]);
  }

  onReexport() {
    this.api.reExportBatch(this.selectedBatch.id).subscribe((response: any) => {
      if (response.response.errors) {
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else if (response.response.data[0].errors) {
        this.ui.showErrorSnackBar(response.response.data[0].errors[0].message);
      }
    })
    
  }

  onStateChanged() {
    this.pageIndex = 0;
    const q: any = {};
    q['state'] = this.selectedState;
    q.page = null;
    this.router.navigate([], { queryParams: q, queryParamsHandling: 'merge' });

    // this.reloadBatches();
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
        this.ui.showErrorDialogFromObject(response.response.errors);
        return;
      }

      const batch: Batch = Batch.fromJson(response['response']['data'][0]);

      const dialogRef = this.dialog.open(ImportDialogComponent, { 
        data: { batch: batch.id },
        panelClass: 'app-dialog-import',
        width: '600px' 
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result === 'open') {
          this.onIngestBatch();
        } else {
          this.reloadBatches();
        }

      });
    });
  }

  stop(b: Batch) {
    this.api.stopBatch(b.id).subscribe((response: any) => {

      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(response.response.errors);
        return;
      }

      this.reloadBatches();

      // const batch: Batch = Batch.fromJson(response['response']['data'][0]);
      //
      // const dialogRef = this.dialog.open(ImportDialogComponent, { data: { batch: batch.id } });
      // dialogRef.afterClosed().subscribe(result => {
      //
      //   if (result === 'open') {
      //     this.onIngestBatch();
      //   } else {
      //     this.reloadBatches();
      //   }
      //
      // });
    });
  }

}
