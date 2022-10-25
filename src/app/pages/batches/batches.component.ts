import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { IngestDialogComponent } from 'src/app/dialogs/ingest-dialog/ingest-dialog.component';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Batch } from 'src/app/model/batch.model';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { IConfig, defaultLayoutConfig, LayoutAdminComponent } from '../layout-admin/layout-admin.component';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  localStorageName = 'proarc-layout-import';
  config: IConfig = null;
  state: string;
  batchId: string;
  parent: DocumentItem | null;
  previousItem: DocumentItem | null;
  nextItem: DocumentItem | null;
  // selected: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.initConfig();
    this.layout.type = 'import';

    this.layout.shouldRefresh().subscribe(() => {
      this.loadData(this.batchId);
    });

    this.layout.selectionChanged().subscribe(() => {
      this.setVisibility();
    });


    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.batchId = p.get('batch_id');
        if (this.batchId) {
          this.loadData(this.batchId);
        }
      });
  }

  setVisibility() {

    this.config.columns.forEach(c => {
      c.rows.forEach(r => {
        if (r.type === 'image' && r.visible) {
          r.isEmpty = !(this.layout.selectedItem && this.layout.selectedItem.isPage());
        }
      });
      c.visible = c.rows.findIndex(r => r.visible && !r.isEmpty) > -1;
    });

  }

  showLayoutAdmin() {
    const dialogRef = this.dialog.open(LayoutAdminComponent, { data: { layout: 'import'} });
    dialogRef.afterClosed().subscribe((ret: any) => {
      
        this.initConfig();
        this.loadData(this.batchId);
    });
  }

  initConfig() {
    if (localStorage.getItem(this.localStorageName)) {
      this.config = JSON.parse(localStorage.getItem(this.localStorageName))
    } else {
      this.config = JSON.parse(JSON.stringify(defaultLayoutConfig));
    }
  }


  loadData(id: string) {
    this.layout.ready = false;

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
        const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
        this.layout.item = obj;
        this.layout.items = pages;
        this.layout.items[0].selected = true;
        this.layout.ready = true;
        this.layout.setSelection();

        // this.layout.allowedChildrenModels = ModelTemplate.allowedChildrenForModel(item.model);

        // this.parent = item;
        // this.layout.parent = item;
        // this.layout.path = [];
        // if (item) {
        //   this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
        //   this.setPath(item.pid);
        // }
        // this.setupNavigation();
        this.setVisibility();
      });
    });


  }

  onIngest() {

    if (this.hasPendingChanges()) {
      const d = this.confirmLeaveDialog().subscribe((result: any) => {
        if (result === 'true') {
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
      const dialogRef = this.dialog.open(ParentDialogComponent, { data: { btnLabel: 'import.save' } });
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
        this.router.navigate(['/document', parentPid]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  hasPendingChanges(): boolean {
    return false;
  }

  public getBatchParent(): string | undefined {
    return undefined;
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

}
