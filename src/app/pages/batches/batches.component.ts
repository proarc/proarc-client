
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { Subscription, combineLatest, of, switchMap } from 'rxjs';
import { IngestDialogComponent } from '../../dialogs/ingest-dialog/ingest-dialog.component';
import { LayoutAdminComponent } from '../../dialogs/layout-admin/layout-admin.component';
import { ParentDialogComponent } from '../../dialogs/parent-dialog/parent-dialog.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { Batch } from '../../model/batch.model';
import { DocumentItem } from '../../model/documentItem.model';
import { ResizecolDirective } from '../../resizecol.directive';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { PanelComponent } from "../../components/panel/panel.component";

@Component({
  selector: 'app-batches',
  imports: [TranslateModule, FormsModule, AngularSplitModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, PanelComponent],
  templateUrl: './batches.component.html',
  styleUrl: './batches.component.scss'
})
export class BatchesComponent {

  loading: boolean;
  state: string;
  batchId: string;
  parent: DocumentItem | null;
  previousItem: DocumentItem | null;
  nextItem: DocumentItem | null;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public layout: LayoutService,
    public settings: UserSettings,
    private settingsService: UserSettingsService,
    private ui: UIService,
    private translator: TranslateService,
    private api: ApiService
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.layout.setLastSelectedItem(null);
  }

  ngOnInit(): void {
    this.layout.type = 'import';
    this.initConfig();

    this.subscriptions.push(this.layout.shouldRefresh().subscribe((keepSelection: boolean) => {
      this.loadData(this.batchId, keepSelection);
    }));

    // this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
    //   this.refreshSelected(from);
    // }));

    const s = this.route.paramMap.pipe(
      switchMap(p => {
        this.batchId = p.get('batch_id');
        if (this.batchId) {
          this.loadData(this.batchId, false);
        }
        return of(true);
      })
    );
    s.subscribe();


  }

  refreshSelected(from: string) {
    if (from === 'pages') {
      this.refreshPages();
      return;
    }
    this.api.getBatchPage(this.layout.batchId, this.layout.lastSelectedItem().pid).subscribe((response: any) => {

      const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
      const selected = this.layout.lastSelectedItem().selected;
      Object.assign(this.layout.lastSelectedItem, pages[0]);
      this.layout.lastSelectedItem().selected = selected;
      if (!!from) {
        //this.layout.shouldMoveToNext(from);
      }
    });
  }

  refreshPages() {
    const selection: string[] = [];
    const lastSelected = this.layout.lastSelectedItem().pid;
    this.layout.items().forEach(item => {
      if (item.selected) {
        selection.push(item.pid);
      }
    });

    this.api.getBatchPages(this.layout.batchId).subscribe((response: any) => {

      if (response['response'].status === -1) {
        this.ui.showErrorSnackBar(response['response'].data);
        // this.router.navigate(['/import/history']);
        return;
      }

      const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
      this.layout.setItems(pages);
      for (let i = 0; i < this.layout.items.length; i++) {
        const item = this.layout.items()[i];
        if (selection.includes(item.pid)) {
          item.selected = true;
        }
        if (item.pid === lastSelected) {
          this.layout.setLastSelectedItem(item);
        }
      }
    });
  }

  showLayoutAdmin() {
    const dialogRef = this.dialog.open(LayoutAdminComponent, {
      data: { layout: 'import' },
      width: '1280px',
      height: '90%',
      panelClass: 'app-dialog-layout-settings'
    });
    dialogRef.afterClosed().subscribe((ret: any) => {

      this.initConfig();
      this.loadData(this.batchId, true);
    });
  }

  initConfig() {
    let idx = 0;
    this.layout.panels = [];

    this.settings.importLayout.columns.forEach(c => {
      c.rows.forEach(r => {
        if (!r.id) {
          r.id = 'panel' + idx++;
        }
        this.layout.panels.push(r);
      });
    });
    this.layout.clearPanelEditing();
  }



  loadData(id: string, keepSelection: boolean) {
    const selection: string[] = [];
    if (keepSelection) {
      this.layout.items().forEach(item => {
        if (item.selected) {
          selection.push(item.pid);
        }
      })
    }
    this.loading = true;
    this.layout.selectedParentItem = null;

    const obj = new DocumentItem();
    obj.pid = id;
    this.api.getImportBatch(parseInt(id)).subscribe((batch: Batch) => {
      obj.parent = batch.parentPid;
      this.layout.batchId = id;
      this.api.getBatchPages(id).subscribe((response: any) => {
        if (response['response'].errors) {
          const a = this.ui.showErrorDialogFromObject(response['response'].errors);

          a.afterClosed().subscribe(result => {
            this.router.navigate(['/process-management']);
          });
          return;
        }
        if (response['response'].status === -1) {
          this.ui.showErrorSnackBar(response['response'].data);
          return;
        }
        const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
        this.layout.item = obj;
        this.layout.setItems(pages);
        this.layout.setLastSelectedItem(this.layout.items()[0]);
        this.layout.selectedParentItem = obj;
        if (keepSelection) {
          this.layout.items().forEach(item => {
            if (selection.includes(item.pid)) {
              item.selected = true;
            }
          })
        } else if (this.layout.items.length > 0) {
          this.layout.items()[0].selected = true;
        }

        this.loading = false;

        this.layout.setSelection(false, null);

      });
    });


  }

  onIngest() {
    if (this.hasPendingChanges()) {
      const d = this.confirmLeaveDialog().subscribe((result: any) => {
        if (result === 'true') {
          this.tryIngest();
        }
      });
    } else {
      this.tryIngest();
    }
  }

  validatePages(): number {
    let valid = true;
    let invalidCount = 0;
    this.layout.items().forEach((p: DocumentItem) => {
      if (p.isPage()) {
        valid = valid && p.isValidPage();
        p.invalid = !p.isValidPage();
        if (p.invalid) {
          invalidCount++
        }
      } else if (p.isAudioPage()) {
        valid = valid && p.isValidAudioPage();
        p.invalid = !p.isValidAudioPage();
        if (p.invalid) {
          invalidCount++
        }
      }

    });
    return invalidCount;
  }

  tryIngest() {
    const invalidCount = this.validatePages();
    if (invalidCount > 0) {
      let message = String(this.translator.instant('dialog.childrenValidation.alert.error', { value1: invalidCount, value2: this.layout.items.length }));
      const data: SimpleDialogData = {
        title: 'Nevalidní data',
        message,
        alertClass: 'app-message',
        btn1: {
          label: "Zpět",
          value: 'no',
          color: 'warn'
        },
        // btn2: {
        //   label: "Nepokračovat",
        //   value: 'no',
        //   color: 'default'
        // },
      };
      const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.ingest();
        }
      });
    } else {
      this.ingest();
    }
  }



  confirmLeaveDialog() {
    const data: SimpleDialogData = {
      title: 'Upozornění',
      message: 'Opouštíte formulář bez uložení. Opravdu chcete pokračovat?',
      alertClass: 'app-message',
      btn1: {
        label: "Ano",
        value: 'true',
        color: 'warn'
      },
      btn2: {
        label: "Ne",
        value: 'false',
        color: 'default'
      },
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    return dialogRef.afterClosed();
  }

  ingest() {
    const batchParent = this.getBatchParent();
    if (batchParent) {
      this.ingestBatch(batchParent);
    } else {


      const dialogRef = this.dialog.open(ParentDialogComponent, {
        data: {
          btnLabel: 'editor.children.relocate_label',
          parent: null,
          items: this.layout.items(),
          displayedColumns: ['filename', 'pageType', 'pageNumber', 'pageIndex', 'pagePosition'],
          isRepo: false,
          batchId: this.batchId
        },
        // data: {
        //   btnLabel: 'import.save', items: this.layout.items
        // },
        width: '95%',
        maxWidth: '100vw',
        height: '90%',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.pid) {
          this.ingestBatch(result.pid);
        }
      });
    }
  }

  private ingestBatch(parentPid: string) {
    this.state = 'loading';
    const bathId = parseInt(this.batchId);
    const dialogRef = this.dialog.open(IngestDialogComponent, { data: { batch: bathId, parent: parentPid } });
    dialogRef.afterClosed().subscribe(result => {
      this.state = 'success';
      if (result == 'open') {
        this.router.navigate(['/repository', parentPid]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  hasPendingChanges(): boolean {
    return false;
  }

  public getBatchParent(): string | undefined {
    return this.layout.item.parent;
  }

  formatPagesCount(): string {
    if (!this.layout.items) {
      return "";
    }
    const c = this.layout.items.length;
    if (c == 0) {
      return 'žádná strana';
    }
    if (c == 1) {
      return '1 strana';
    }
    if (c < 5) {
      return `${c} strany`;
    }
    return `${c} stran`;
  }

  onDragEnd(columnindex: number, e: any) {
    // Column dragged
    if (columnindex === -1) {
      // Set size for all visible columns
      this.settings.importLayout.columns.filter((c) => c.visible === true).forEach((column, index) => (column.size = e.sizes[index]))
    }
    // Row dragged
    else {
      // Set size for all visible rows from specified column
      this.settings.repositoryLayout.columns[columnindex].rows
        .filter((r) => r.visible === true)
        .forEach((row, index) => (row.size = e.sizes[index]))
    }
    this.settingsService.save()
    // this.layout.setResized();
  }



}
