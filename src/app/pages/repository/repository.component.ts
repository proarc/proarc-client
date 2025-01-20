import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { DocumentItem } from '../../model/documentItem.model';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { forkJoin, of, switchMap } from 'rxjs';
import { IConfig, ILayoutPanel, LayoutAdminComponent } from '../../dialogs/layout-admin/layout-admin.component';
import { CzidloDialogComponent } from '../../dialogs/czidlo-dialog/czidlo-dialog.component';
import { ExportDialogComponent } from '../../dialogs/export-dialog/export-dialog.component';
import { LogDialogComponent } from '../../dialogs/log-dialog/log-dialog.component';
import { UpdateInSourceDialogComponent } from '../../dialogs/update-in-source-dialog/update-in-source-dialog.component';
import { UrnnbnDialogComponent } from '../../dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { Batch } from '../../model/batch.model';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';

@Component({
  selector: 'app-repository',
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule,
    MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatTooltipModule, MatMenuModule
  ],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent {

  loading: boolean;

  panels: ILayoutPanel[] = [];
  editingPanel: string;


  pid: string;  // pid in url
  public item: DocumentItem; // item by pid in url
  public items: DocumentItem[] | null; // all children items
  public lastSelectedItem: DocumentItem; // last selected child item

  path: { pid: string, label: string, model: string }[] = [];
  public parent: DocumentItem;
  public previousItem: DocumentItem | null;
  public nextItem: DocumentItem | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public auth: AuthService,
    public config: Configuration,
    private ui: UIService,
    private api: ApiService,
    public settings: UserSettings,
    private settingsService: UserSettingsService,
    // private repo: RepositoryService,
    // public layout: LayoutService,
    // private tmpl: TemplateService
  ) { }

  ngOnInit() {
    // this.route.queryParams.subscribe(p => {
    const s = this.route.paramMap.pipe(
      switchMap(p => {
        this.pid = p.get('pid');
        if (this.pid) {
          this.loadData(false);
        }
        return of(true);
      })
    );
    s.subscribe();
  }

  loadData(keepSelection: boolean) {
    this.initConfig();
    let pid = this.pid;
    const selection: string[] = [];
    let path: string[] = [];
    let lastSelected: string = null;
    let selectedParentItem: DocumentItem = null;
    // if (keepSelection) {
    //   this.layout.items.forEach(item => {
    //     if (item.selected) {
    //       selection.push(item.pid);
    //     }
    //   });
    //   pid = this.layout.lastSelectedItem.pid;
    //   lastSelected = this.layout.lastSelectedItem.pid;
    //   selectedParentItem = this.layout.selectedParentItem;
    //   path = JSON.parse(JSON.stringify(this.layout.expandedPath));
    // }

    this.loading = true;
    this.path = [];
    // this.layout.tree = null;
    // this.layout.parent = null;
    // this.layout.selectedParentItem = null;
    this.lastSelectedItem = null;
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    const rParent = this.api.getParent(pid);
    forkJoin([rDoc, rChildren, rParent]).subscribe(([item, children, parent]: [DocumentItem, DocumentItem[], DocumentItem]) => {
      this.item = item;
      this.lastSelectedItem = item;
      this.items = children;
      if (keepSelection) {
        // this.layout.items.forEach(ch => {
        //   if (selection.includes(ch.pid)) {
        //     ch.selected = true;
        //   }
        //   if (ch.pid === lastSelected) {
        //     this.layout.lastSelectedItem = ch;
        //   }
        // });
        // this.layout.selectedParentItem = selectedParentItem;
      }
      // if (this.canHasChildren(item.model) && !keepSelection) {
      //   this.layout.selectedParentItem = item;
      // }

      // this.layout.setSelection(false, null);
      // this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });

      // if (parent) {
      //   this.layout.parent = parent;
      //   this.layout.item.parent = parent.pid;
      //   if (!this.canHasChildren(item.model)) {
      //     if (!keepSelection) {
      //       this.layout.selectedParentItem = parent;
      //     }

      //     // find siblings
      //     this.api.getRelations(parent.pid).subscribe((siblings: DocumentItem[]) => {
      //       if (siblings.length > 0) {
      //         this.layout.items = siblings;
      //         this.layout.items.forEach(item => { item.selected = item.pid === pid });
      //         this.layout.setSelection(false, null);
      //       }
      //     });
      //   }
      //   this.layout.path.unshift({ pid: parent.pid, label: parent.label, model: parent.model });
      //   this.setLayoutPath(parent, keepSelection, path);
      // } else {
      //   this.layout.rootItem = item;

      // }
      // if (keepSelection) {
      //   this.layout.expandedPath = JSON.parse(JSON.stringify(path));
      // } else {
      //   this.layout.expandedPath = this.layout.path.map(p => p.pid);
      // }
      // this.getBatchInfo();
      // this.setupNavigation();
      this.loading = false;
    });
  }

  // Actions
  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }

  selectLast() {
    // this.layout.items.forEach(i => i.selected = false);
    // this.layout.lastSelectedItem = this.layout.item;
    // this.layout.setSelection(false, null);
  }

  public goToObject(item: DocumentItem) {
    if (item) {
      this.router.navigate(['/repository', item.pid]);
    }
  }

  public goToFirst() {
    this.router.navigate(['/repository', this.parent.pid]);
  }

  onExport() {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      disableClose: true,
      data: [{ pid: this.item.pid, model: this.item.model }],
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onUrnnbn() {
    const dialogRef = this.dialog.open(UrnnbnDialogComponent, {
      data: [this.item.pid],
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }


  canCopy(): boolean {
    if (this.item) {
      return this.config.allowedCopyModels.includes(this.item.model)
    } else {
      return false;
    }

  }

  onCopyItem() {
    this.api.copyObject(this.item.pid, this.item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      } else if (response.response.data && response.response.data[0].validation) {
        this.ui.showErrorDialogFromObject(response.response.data.map((d: any) => d.errorMessage = d.validation));
      } else {
        this.ui.showInfoSnackBar("Objekty byly zkopirovane");

      }
    }, error => {
      console.log(error);
      this.ui.showInfoSnackBar(error.statusText);
    });
  }

  czidlo() {

    const dialogRef = this.dialog.open(CzidloDialogComponent, {
      data: { pid: this.item.pid, model: this.item.model },
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  canUpdateInSource() {
    if (this.item) {
      return this.config.updateInSourceModels.includes(this.item.model)
    } else {
      return false;
    }

  }

  updateInSource() {

    const dialogRef = this.dialog.open(UpdateInSourceDialogComponent, {
      data: this.item.pid,
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  validateObject() {
    this.api.validateObject(this.item.pid).subscribe((response: any) => {
      if (response.response.errors) {
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.ui.showInfoSnackBar(response.response.data[0].msg)
      }
    });
  }

  batchInfo: string;
  onShowLog() {
    const data = {
      content: this.batchInfo
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

  getBatchInfo() {
    this.batchInfo = null;
    let params: any = {
      description: this.item.pid,
    };

    this.api.getImportBatches(params).subscribe((resp: any) => {
      const batches = resp.data.map((d: any) => Batch.fromJson(d));
      if (batches.length > 0 && batches[0].failure) {
        this.batchInfo = batches[0].failure
      }
    });

  }

  showLayoutAdmin() {
    const dialogRef = this.dialog.open(LayoutAdminComponent, {
      data: { layout: 'repo' },
      width: '1280px',
      height: '90%',
      panelClass: 'app-dialog-layout-settings'
    });
    dialogRef.afterClosed().subscribe((ret: any) => {
      if (ret) {
        this.initConfig();
        this.loadData(true);
      }
    });
  }

  setPanelEditing(panel: ILayoutPanel) {

    if (panel && this.editingPanel !== panel.id) {
      this.panels.forEach(p => p.canEdit = false || p.type === 'media');
      panel.canEdit = true;
      this.editingPanel = panel.id
    }
  }

  clearPanelEditing() {
    this.panels.forEach(p => p.canEdit = true);
    this.editingPanel = '';
  }

  initConfig() {
    let idx = 0;
    this.panels = [];

    this.settings.repositoryLayout.columns.forEach(c => {
      c.rows.forEach(r => {
        if (!r.id) {
          r.id = 'panel' + idx++;
        }
        this.panels.push(r);
      });
    });
    this.clearPanelEditing();
  }

  onDragEnd(columnindex: number, e: any) {
    // Column dragged
    if (columnindex === -1) {
      // Set size for all visible columns
      this.settings.repositoryLayout.columns.filter((c) => c.visible === true).forEach((column, index) => (column.size = e.sizes[index]))
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


  hasPendingChanges(): boolean {
    return false;
  }

}
