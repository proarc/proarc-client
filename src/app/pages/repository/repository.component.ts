
import { Component, effect } from '@angular/core';
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
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { IConfig, LayoutAdminComponent } from '../../dialogs/layout-admin/layout-admin.component';
import { CzidloDialogComponent } from '../../dialogs/czidlo-dialog/czidlo-dialog.component';
import { ExportDialogComponent } from '../../dialogs/export-dialog/export-dialog.component';
import { LogDialogComponent } from '../../dialogs/log-dialog/log-dialog.component';
import { UpdateInSourceDialogComponent } from '../../dialogs/update-in-source-dialog/update-in-source-dialog.component';
import { UrnnbnDialogComponent } from '../../dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { Batch } from '../../model/batch.model';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { PanelComponent } from "../../components/panel/panel.component";
import { LayoutService } from '../../services/layout-service';
import { ModelTemplate } from '../../model/modelTemplate';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-repository',
  imports: [TranslateModule, FormsModule, AngularSplitModule, MatCardModule, 
    MatIconModule, MatButtonModule, MatProgressBarModule, 
    MatTooltipModule, MatMenuModule, PanelComponent],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent {

  loading: boolean;
  pid: string;  // pid in url
  path: { pid: string, label: string, model: string }[] = [];

  repositoryLayout: IConfig;
  
    subscriptions: Subscription[] = [];

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
    public layout: LayoutService
    // private tmpl: TemplateService
  ) { 
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.layout.setLastSelectedItem(null);
  }

  ngOnInit() {
    this.layout.type = 'repo';
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
    this.subscriptions.push(this.layout.shouldRefresh().subscribe((keepSelection: boolean) => {
      this.loadData(false);
    }));
  }

  loadData(keepSelection: boolean) {
    this.loading = true;
    this.initConfig();
    let pid = this.pid;
    const selection: string[] = [];
    let path: string[] = [];
    let lastSelected: string = null;
    let selectedParentItem: DocumentItem = null;
    if (keepSelection) {
      this.layout.items().forEach(item => {
        if (item.selected) {
          selection.push(item.pid);
        }
      });
      // pid = this.layout.lastSelectedItem().pid;
      lastSelected = this.layout.lastSelectedItem().pid;
      selectedParentItem = this.layout.selectedParentItem;
      path = JSON.parse(JSON.stringify(this.layout.expandedPath));
    }

    this.path = [];
    // this.layout.tree = null;
    this.layout.parent = null;
    this.layout.selectedParentItem = null;
    this.layout.setLastSelectedItem(null);
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    const rParent = this.api.getParent(pid);
    forkJoin([rDoc, rChildren, rParent]).subscribe(([item, children, parent]: [DocumentItem, DocumentItem[], DocumentItem]) => {
      this.layout.item = item;
      this.layout.items.set(children);
      if (keepSelection) {
        this.layout.items().forEach(ch => {
          if (selection.includes(ch.pid)) {
            ch.selected = true;
          }
          console.log(ch)
          if (ch.pid === lastSelected) {
            this.layout.setLastSelectedItem(ch);
          }
        });
        this.layout.selectedParentItem = selectedParentItem;
      } else {
        this.layout.setLastSelectedItem(item);
      }
      if (this.canHasChildren(item.model) && !keepSelection) {
        this.layout.selectedParentItem = item;
      }

      this.layout.setSelection(false, null);
      this.path.unshift({ pid: item.pid, label: item.label, model: item.model });

      if (parent) {
        this.layout.parent = parent;
        this.layout.item.parent = parent.pid;
        if (!this.canHasChildren(item.model)) {
          if (!keepSelection) {
            this.layout.selectedParentItem = parent;
          }

          // find siblings
          this.api.getRelations(parent.pid).subscribe((siblings: DocumentItem[]) => {
            if (siblings.length > 0) {
              this.layout.setItems(siblings);
              this.layout.items().forEach(item => { item.selected = item.pid === pid });
              this.layout.setSelection(false, null);
            }
          });
        }
        this.path.unshift({ pid: parent.pid, label: parent.label, model: parent.model });
        this.setLayoutPath(parent, keepSelection, path);
      } else {
        this.layout.rootItem = item;

      }

      if (keepSelection) {
        this.layout.expandedPath = JSON.parse(JSON.stringify(path));
      } else {
        this.layout.expandedPath = this.path.map(p => p.pid);
      }
      this.getBatchInfo();
      this.setupNavigation();
      this.loading = false;
    });
  }

  private setupNavigation() {
    this.layout.previousItem = null;
    this.layout.nextItem = null;
    if (!this.layout.parent) {
      return;
    }
    const parentId = this.layout.parent.pid;
    this.api.getRelations(this.layout.parent.pid).subscribe((siblings: DocumentItem[]) => {
      let index = -1;
      let i = -1;
      for (const sibling of siblings) {
        i += 1;
        if (sibling.pid === this.layout.item.pid) {
          index = i;
          break;
        }
      }
      if (index >= 1 && this.layout.parent.pid == parentId) {
        this.layout.previousItem = siblings[index - 1];
      }
      if (index >= 0 && index < siblings.length - 1) {
        this.layout.nextItem = siblings[index + 1];
      }
    });
  }


  setLayoutPath(item: DocumentItem, keepSelection: boolean, path: string[]) {
    this.api.getParent(item.pid).subscribe((parent: DocumentItem) => {
      if (parent) {
        this.path.unshift({ pid: parent.pid, label: parent.label, model: parent.model });
        this.setLayoutPath(parent, keepSelection, path);
      } else {
        this.layout.rootItem = item;

        if (keepSelection) {
          this.layout.expandedPath = JSON.parse(JSON.stringify(path));
        } else {
          this.layout.expandedPath = this.path.map(p => p.pid);
        }
      }
    });
  }

  canHasChildren(model: string): boolean {
    const a = ModelTemplate.allowedChildrenForModel(this.config.models, model)
    return a?.length > 0;
  }

  // Actions
  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }

  selectLast() {
    this.layout.items().forEach(i => i.selected = false);
    this.layout.setLastSelectedItem(this.layout.item);
    this.layout.setSelection(false, null);
  }

  public goToObject(item: DocumentItem) {
    if (item) {
      this.router.navigate(['/repository', item.pid]);
    }
  }

  public goToFirst() {
    this.router.navigate(['/repository', this.layout.items()[0].pid]);
  }

  onExport() {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      disableClose: true,
      data: [{ pid: this.layout.item.pid, model: this.layout.item.model }],
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onUrnnbn() {
    const dialogRef = this.dialog.open(UrnnbnDialogComponent, {
      data: [this.layout.item.pid],
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }


  canCopy(): boolean {
    if (this.layout.item) {
      return this.config.allowedCopyModels.includes(this.layout.item.model)
    } else {
      return false;
    }

  }

  onCopyItem() {
    this.api.copyObject(this.layout.item.pid, this.layout.item.model).subscribe((response: any) => {
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
      data: { pid: this.layout.item.pid, model: this.layout.item.model },
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  canUpdateInSource() {
    if (this.layout.item) {
      return this.config.updateInSourceModels.includes(this.layout.item.model)
    } else {
      return false;
    }

  }

  updateInSource() {

    const dialogRef = this.dialog.open(UpdateInSourceDialogComponent, {
      data: this.layout.item.pid,
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  validateObject() {
    this.api.validateObject(this.layout.item.pid).subscribe((response: any) => {
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
      description: this.layout.item.pid,
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
        this.loadData(false);
      }
    });
  }

  initConfig() {
    let idx = 0;
    this.layout.panels = [];

    this.settings.repositoryLayout.columns.forEach(c => {
      c.rows.forEach(r => {
        if (!r.id) {
          r.id = 'panel' + idx++;
        }
        this.layout.panels.push(r);
      });
    });
    this.layout.clearPanelEditing();
    this.repositoryLayout = Utils.clone(this.settings.repositoryLayout)
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
