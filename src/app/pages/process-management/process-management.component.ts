import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { ResizecolDirective } from '../../resizecol.directive';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LogDialogComponent } from '../../dialogs/log-dialog/log-dialog.component';
import { Batch } from '../../model/batch.model';
import { Profile } from '../../model/profile.model';
import { User } from '../../model/user.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { ProArc } from '../../utils/proarc';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReloadBatchDialogComponent } from '../../dialogs/reload-batch-dialog/reload-batch-dialog.component';
import { ResolveConflictDialogComponent } from '../../dialogs/resolve-conflict-dialog/resolve-conflict-dialog.component';
import { ImportDialogComponent } from '../../dialogs/import-dialog/import-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';

@Component({
  selector: 'app-process-management',
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule, RouterModule,
    MatDatepickerModule, MatCheckboxModule,
    MatTableModule, MatSortModule, ResizecolDirective, UserTableComponent],
  templateUrl: './process-management.component.html',
  styleUrl: './process-management.component.scss'
})
export class ProcessManagementComponent {


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

  progressMapSignal = signal<{[key: string]: string}>({});
  progressMap: {[key: string]: string} = {};

  description: string;
  user: string;
  priority: string;
  profile: string;
  createFrom: Date;
  createTo: Date;
  modifiedFrom: Date;
  modifiedTo: Date;

  displayedColumnsOverview: string[] = ['description', 'create', 'itemUpdated', 'updated', 'timestamp', 'state', 'profile', 'user', 'priority', 'actions'];
  displayedColumnsQueue: string[] = ['description', 'create', 'itemUpdated', 'updated', 'timestamp', 'state', 'pageCount', 'user'];


  batchStates = [
    'ALL',
    'STOPPED',
    'LOADING',
    'LOADED',
    'LOADING_CONFLICT',
    'LOADING_FAILED',
    'INGESTING',
    'INGESTED',
    'INGESTING_FAILED',
    'EXPORT_PLANNED',
    'EXPORTING',
    'EXPORT_DONE',
    'EXPORT_FAILED',
    'EXPORT_VALID_WARNING',
    'INTERNAL_PLANNED',
    'INTERNAL_RUNNING',
    'INTERNAL_DONE',
    'INTERNAL_FAILED',
    'EXTERNAL_PLANNED',
    'EXTERNAL_RUNNING',
    'EXTERNAL_DONE',
    'EXTERNAL_FAILED',
    'UPLOADING',
    'UPLOAD_DONE',
    'UPLOAD_FAILED',
  ];

  priorities = [
    'lowest',
    'low',
    'medium',
    'high',
    'highest'
  ];

  actions: { icon: string, condition: (e: any) => boolean, action: (e: any) => void, tooltip: string }[] = [];

  constructor(
    private datePipe: DatePipe,
    public auth: AuthService,
    private api: ApiService,
    public ui: UIService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public config: Configuration,
    private translator: TranslateService,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    private clipboard: Clipboard) { }

  ngOnInit() {
    // this.actions.push({
    //   icon: 'delete',
    //   tooltip: 'button.delete',
    //   action: (e: any) => {
    //     this.deleteBatch(e.id);
    //   }
    // });
    this.actions.push({
      icon: 'info',
      tooltip: 'button.viewErrorDetail',
      condition: (e: any) => {
        return e.failure
      },
      action: (e: any) => {
        this.onShowLog(e);
      }
    });
    this.route.queryParams.subscribe(p => {
      this.processParams(p);
      this.loadData();
    });
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
    this.initSelectedColumnsOverview();
    this.initSelectedColumnsQueue();
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
    this.user = p['userId'] ? p['userId'] : null;
    this.priority = p['priority'] ? p['priority'] : null;
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

  selectRow(e: { item: Batch, event?: MouseEvent, idx?: number }) {
    this.batches.forEach(i => i.selected = false);
    e.item.selected = true;
    this.selectBatch(e.item);
  }

  selectBatch(batch: Batch) {
    this.selectedBatch = batch;
  }

  goto(uuid: string) {
    this.router.navigate(['/repository', uuid]);
  }

  openBatch(batch: Batch) {
    if (batch.state === 'INGESTED' && batch.parentPid) {
      this.router.navigate(['/repository', batch.parentPid]);
    } else if (batch.state === 'LOADED') {
      this.router.navigate(['/process-management', 'edit', this.selectedBatch.id]);
    }
  }

  loadData() {
    if (this.view == 'overview') {
      this.reloadBatches();
    } else if (this.view == 'loadingQueue') {
      this.reloadLoadingQueue();
    }
  }

  deleteBatch(id: number) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Smazání procesu')),
      message: String(this.translator.instant('Opravdu chcete smazat proces?')),
      alertClass: 'app-message',
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.api.deleteBatch(id).subscribe((resp: any) => {
          if (resp.response.errors) {
            this.state = 'error';
            this.ui.showErrorDialogFromObject(resp.response.errors);
            return;
          }
          this.state = 'success';
          this.reload();

        });
      }
    });

  }



  onDeleteBatches() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('button.delete_batches_by_filter')),
      message: String(this.translator.instant('Opravdu chcete smazat procesy?')),
      alertClass: 'app-message',
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteBatches();
      }
    });

  }

  deleteBatches() {
    this.selectedBatch = null;
    this.state = 'loading';
    let params: any = {};
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


    this.api.deleteBatches(params).subscribe((resp: any) => {
      if (resp.response.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(resp.response.errors);
        return;
      }
      this.reload();
    });
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
    if (this.selectedState) {
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
      params['modifiedTo'] = null;
    }

    params.page = null;
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

  reload() {
    // this.pageIndex = 0;
    this.loadData();
  }

  sort: Sort = {active: 'timestamp', direction: 'desc'} ;
  sortTable(e: Sort) {
    this.sort = {active: e.active, direction: e.direction};
    this.loadData();
  }

  reloadBatches() {
    this.selectedBatch = null;
    this.state = 'loading';
    const start = this.pageIndex * this.pageSize;
    let params: any = {
      // sortBy: '-timestamp',
      _sortBy: (this.sort.direction === 'desc' ? '-' : '') + this.sort.active,
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

  reloadLoadingQueue() {
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
      if (batch.isLoading() && batch.profile !== 'profile.default_archive_import' && batch.profile !== 'profile.default_ndk_import') {
        this.api.getImportBatchStatusOld(batch.id).subscribe(
          (response: any) => {

            if (response.response.errors) {
              this.ui.showErrorSnackBar(response.response.errors);
              // this.state = 'error';
              // this.ui.showErrorDialogFromObject(response.response.errors);
              // clearInterval(this.timer);
              // this.state = 'failure';
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
            this.progressMapSignal.update(pm => this.progressMap);
          });
      }
    }
  }


  onReloadBatch() {
    console.log(this.selectedBatch.profile);
    const dialogRef = this.dialog.open(ReloadBatchDialogComponent, {
      data: null,
      panelClass: ['app-dialog-reload-batch', 'app-form-view-' + this.settings.appearance],
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.profile) {
        this.reloadBatch(result.profile);
      }
    });
  }

  onResolveConflict() {
    if (!this.selectedBatch) {
      return;
    }
    const dialogRef = this.dialog.open(ResolveConflictDialogComponent, {
      data: this.selectedBatch,
      panelClass: ['app-dialog-import', 'app-form-view-' + this.settings.appearance],
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.resolveConflict(this.selectedBatch.id, this.selectedBatch.profile, result.useNewMetadata).subscribe((batch: Batch) => {
          this.reloadBatches();
        });
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
    this.router.navigate(['/process-management', 'edit', this.selectedBatch.id]);
  }


  private ingestBatch(parentPid: string) {
    if (!this.selectedBatch) {
      return;
    }
    if (ProArc.dontShowStatusByProfile(this.selectedBatch.profile)) {
      return;
    }
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      data: { batch: this.selectedBatch.id, parent: parentPid, ingestOnly: true },
      panelClass: ['app-dialog-import', 'app-form-view-' + this.settings.appearance],
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

    if (ProArc.dontShowStatusByProfile(profile.id)) {
      return;
    }
    this.api.reloadBatch(this.selectedBatch.id, profile.id).subscribe((batch: Batch) => {
      const dialogRef = this.dialog.open(ImportDialogComponent, {
        data: { batch: batch.id },
        panelClass: ['app-dialog-import', 'app-form-view-' + this.settings.appearance],
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
    this.dialog.open(LogDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-log', 'app-form-view-' + this.settings.appearance]
    });
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
    this.reloadBatches();
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

      if (ProArc.dontShowStatusByProfile(b.profile)) {
        return;
      }

      const batch: Batch = Batch.fromJson(response['response']['data'][0]);

      const dialogRef = this.dialog.open(ImportDialogComponent, {
        data: { batch: batch.id },
        panelClass: ['app-dialog-import', 'app-form-view-' + this.settings.appearance],
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

  stopBatch(b: Batch) {
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

  // resizable columns

  initSelectedColumnsOverview() {
    this.displayedColumnsOverview = this.settings.procMngColumns.filter(c => c.selected).map(c => c.field);
  }

  getColumnWidthOverview(field: string) {
    const el = this.settings.procMngColumns.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesOverview(e: any, field?: string) {
    const el = this.settings.procMngColumns.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.settingsService.save();
  }

  initSelectedColumnsQueue() {
    this.displayedColumnsQueue = this.settings.queueColumns.filter(c => c.selected).map(c => c.field);
  }

  getColumnWidthQueue(field: string) {
    const el = this.settings.queueColumns.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesQueue(e: any, field?: string) {
    const el = this.settings.queueColumns.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.settingsService.save();
  }
  // end


  setBadgeFilter(val: string) {
    this.pageIndex = 0;
    const q: any = {};
    q['state'] = val;
    q.page = null;
    this.router.navigate([], { queryParams: q, queryParamsHandling: 'merge' });
  }

  canStopProcess() {
    return this.selectedBatch &&
      (
        this.auth.isAdmin() || this.auth.isSuperAdmin() ||
        this.auth.user.name === this.selectedBatch.user
      ) &&
      (this.selectedBatch.state === 'EXPORT_PLANNED' || this.selectedBatch.state === 'EXPORTING')
  }

  isExportProfile(profile: string) {
    return (profile === 'exportProfile.kramerius' || profile === 'exportProfile.ndk' || profile === 'exportProfile.archive' ||
      profile === 'exportProfile.desa' || profile === 'exportProfile.cejsh' || profile === 'exportProfile.crossref' ||
      profile === 'exportProfile.kwis' || profile === 'exportProfile.aleph' || profile === 'exportProfile.datastream');
  }

}
