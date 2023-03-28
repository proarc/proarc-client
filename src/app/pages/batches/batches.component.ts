import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { IngestDialogComponent } from 'src/app/dialogs/ingest-dialog/ingest-dialog.component';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Batch } from 'src/app/model/batch.model';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Page } from 'src/app/model/page.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { IConfig, defaultLayoutConfig, LayoutAdminComponent } from 'src/app/dialogs/layout-admin/layout-admin.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  localStorageName = 'proarc-layout-import';
  // config: IConfig = null;
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
    private properties: LocalStorageService,
    private ui: UIService,
    private translator: TranslateService,
    private api: ApiService
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.layout.lastSelectedItem = null;
  }

  ngOnInit(): void {
    this.initConfig();
    this.layout.type = 'import';

    this.subscriptions.push(this.layout.shouldRefresh().subscribe((keepSelection: boolean) => {
      this.loadData(this.batchId, keepSelection);
    }));

    this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
      this.refreshSelected(from);
    }));

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.batchId = p.get('batch_id');
        if (this.batchId) {
          this.loadData(this.batchId, false);
        }
      });
  }

  refreshSelected(from: string) {
    if (from === 'pages') {
      this.refreshPages();
      return;
    }
    this.api.getBatchPage(this.layout.getBatchId(), this.layout.lastSelectedItem.pid).subscribe((response: any) => {

      const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
      const selected = this.layout.lastSelectedItem.selected;
      Object.assign(this.layout.lastSelectedItem, pages[0]);
      this.layout.lastSelectedItem.selected = selected;
      if (!!from) {
        this.layout.shouldMoveToNext(from);
      }
    });
  }

  refreshPages() {
    const selection: string[] = [];
    const lastSelected = this.layout.lastSelectedItem.pid;
    this.layout.items.forEach(item => {
      if (item.selected) {
        selection.push(item.pid);
      }
    });

    this.api.getBatchPages(this.layout.getBatchId()).subscribe((response: any) => {

      if (response['response'].status === -1) {
        this.ui.showErrorSnackBar(response['response'].data);
        // this.router.navigate(['/import/history']);
        return;
      }

      const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
      this.layout.items = pages;
      for (let i = 0; i < this.layout.items.length; i++) {
        const item = this.layout.items[i];
        if (selection.includes(item.pid)) {
          item.selected = true;
        }
        if (item.pid === lastSelected) {
          this.layout.lastSelectedItem = item;
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
    if (localStorage.getItem(this.localStorageName)) {
      this.layout.layoutConfig = JSON.parse(localStorage.getItem(this.localStorageName))
    } else {
      this.layout.layoutConfig = JSON.parse(JSON.stringify(defaultLayoutConfig));
    }
  }


  loadData(id: string, keepSelection: boolean) {
    const selection: string[] = [];
    if (keepSelection) {
      this.layout.items.forEach(item => {
        if (item.selected) {
          selection.push(item.pid);
        }
      })
    }
    this.layout.ready = false;

    this.layout.path = [];
    this.layout.tree = null;
    this.layout.selectedParentItem = null;

    const obj = new DocumentItem();
    obj.pid = id;
    this.api.getImportBatch(parseInt(id)).subscribe((batch: Batch) => {
      obj.parent = batch.parentPid;
      this.layout.setBatchId(id);
      this.api.getBatchPages(id).subscribe((response: any) => {
        if (response['response'].errors) {
          this.ui.showErrorSnackBarFromObject(response['response'].errors);
          return;
        }
        if (response['response'].status === -1) {
          this.ui.showErrorSnackBar(response['response'].data);
          // this.router.navigate(['/import/history']);
          return;
        }
        const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
        this.layout.item = obj;
        this.layout.items = pages;
        this.layout.lastSelectedItem = this.layout.items[0];
        this.layout.selectedParentItem = obj;
        if (keepSelection) {
          this.layout.items.forEach(item => {
            if (selection.includes(item.pid)) {
              item.selected = true;
            }
          })
        } else if (this.layout.items.length > 0) {
          this.layout.items[0].selected = true;
        }

        this.layout.ready = true;

        this.layout.setSelection(false);

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
    this.layout.items.forEach((p: DocumentItem) => {
      valid = valid && p.isValidPage();
      p.invalid = !p.isValidPage();
      if (p.invalid) {
        invalidCount++
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
        btn1: {
          label: "Pokračovat",
          value: 'yes',
          color: 'warn'
        },
        btn2: {
          label: "Nepokračovat",
          value: 'no',
          color: 'default'
        },
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

      let expandedPath: string[];
      if (this.properties.getStringProperty('parent.expandedPath')) {
        expandedPath = JSON.parse(this.properties.getStringProperty('parent.expandedPath'));
      }

      const dialogRef = this.dialog.open(ParentDialogComponent, {
        data: {
          btnLabel: 'editor.children.relocate_label',
          parent: null,
          items: this.layout.items,
          expandedPath: expandedPath,
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
      this.layout.layoutConfig.columns.filter((c) => c.visible === true).forEach((column, index) => (column.size = e.sizes[index]))
    }
    // Row dragged
    else {
      // Set size for all visible rows from specified column
      this.layout.layoutConfig.columns[columnindex].rows
        .filter((r) => r.visible === true)
        .forEach((row, index) => (row.size = e.sizes[index]))
    }

    localStorage.setItem(this.localStorageName, JSON.stringify(this.layout.layoutConfig));
  }

}
