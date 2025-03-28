import { CommonModule } from '@angular/common';
import { Component, effect, input, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ResizecolDirective } from '../../resizecol.directive';
import { DocumentItem, TreeDocumentItem } from '../../model/documentItem.model';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Batch } from '../../model/batch.model';
import { ModelTemplate } from '../../model/modelTemplate';

@Component({
  selector: 'app-user-tree-table',
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule,
    MatMenuModule, MatPaginatorModule,
    MatTableModule, MatSortModule, ResizecolDirective],
  templateUrl: './user-tree-table.component.html',
  styleUrl: './user-tree-table.component.scss'
})
export class UserTreeTableComponent {

  treeItem = input<TreeDocumentItem>();
  treeInfo = output<{ tree_info: { [model: string]: number }, batchInfo: any }>();
  onSelectTreeItem = output<TreeDocumentItem>();
  onTreeItemsChanged = output<TreeDocumentItem[]>();

  @ViewChild('treeTable') treeTable: MatTable<any>;
  loadingTree: boolean;

  treeColumnsSizes: { [key: string]: string } = {};
  treeColumns: string[] = [];
  treeItems: TreeDocumentItem[] = [];
  visibleTreeItems: TreeDocumentItem[] = [];
  selectedTreeItem: TreeDocumentItem;
  startShiftClickIdxTree: number;
  lastClickIdxTree: number;
  totalSelectedTree: number;
  treeMaxLevel = 0;

  columnTypes: { [field: string]: string } = {};
  lists: { [field: string]: { code: string, value: string }[] } = {};
  prefixes: { [field: string]: string } = {};
  statuses = [
    "undefined",
    "new",
    "assign",
    "connected",
    "processing",
    "described",
    "exported"]

  constructor(private api: ApiService,
    private translator: TranslateService,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    public auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public config: Configuration,
    public ui: UIService) {

    effect(() => {
      this.selectedTreeItem = this.treeItem();
      this.treeItems = [];
      if (!this.selectedTreeItem) {
        return;
      }
      this.treeItems = [this.selectedTreeItem];
      const allowedAsString: string = ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedTreeItem.model).join(',');
      const canHavePages = allowedAsString.includes('page');
      if (this.settings.searchExpandTree || !canHavePages) {
        this.getTreeItems(this.selectedTreeItem, true);
      }
    });
  }

  ngOnInit() {
    this.setSelectedTreeColumns();
  }

  listValue(field: string, code: string) {
    const el = this.lists[field].find(el => el.code === code + '');
    return el ? el.value : code;
  }

  getList(f: string): { code: string, value: string }[] {
    switch (f) {
      case 'status': return this.statuses.map((p: string) => { return { code: p, value: this.translator.instant('editor.atm.statuses.' + p) } });
      case 'model': return this.config.models.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
      default: return [];
    }
  }

  columnType(f: string) {
    return this.settings.columnsSearch.find(c => c.field === f).type;
  }

  prefixByType(f: string): string {
    switch (f) {
      case 'status': return 'editor.atm.statuses.';
      case 'model': return 'model.';
      default: return '';
    }
  }

  initSelectedColumns() {
    this.setSelectedTreeColumns();
  }


  setSelectedTreeColumns() {
    this.treeColumns = this.settings.columnsSearchTree.filter(c => c.selected).map(c => c.field);
    this.treeColumns.forEach(c => {
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnType(c);
      this.prefixes[c] = this.prefixByType(c);

    });
    this.setTreeColumnsWith();
  }

  setTreeColumnsWith() {
    this.treeColumnsSizes = {};
    this.settings.columnsSearchTree.forEach((c: any) => {
      this.treeColumnsSizes[c.field] = c.width + 'px';
    });
  }

  saveTreeColumnsSizes(e: any, field?: string) {
    this.treeColumnsSizes[field] = e + 'px';

    this.settings.columnsSearchTree.forEach((c: any) => {
      c.width = parseInt(this.treeColumnsSizes[c.field]);
    });

    this.settingsService.save();

  }

  toggleTree(event: any, treeItem: TreeDocumentItem) {
    event.stopPropagation();
    event.preventDefault();
    if (!treeItem.expanded) {
      treeItem.expanded = true;
      if (!treeItem.childrenLoaded) {
        this.getTreeItems(treeItem, false);
      }
    } else {
      treeItem.expanded = false;
    }

    this.setToHidden(treeItem, this.treeItems.indexOf(treeItem));

    this.refreshVisibleTreeItems();
  }

  setToHidden(treeItem: TreeDocumentItem, idx: number) {
    for (let i = idx; i < this.treeItems.length; i++) {
      const j = this.treeItems[i]
      if (j.parentPid === treeItem.pid) {
        j.hidden = !treeItem.expanded || treeItem.hidden;
        this.setToHidden(j, i)
      }
    }
  }

  refreshVisibleTreeItems() {
    this.visibleTreeItems = this.treeItems.filter(j => !j.hidden);
    if (this.treeTable) {
      this.treeTable.renderRows();
    }
  }

  getTreeItems(treeItem: TreeDocumentItem, getInfo: boolean, callback?: Function) {
    this.loadingTree = true;

    this.api.getRelations(treeItem.pid).subscribe((children: DocumentItem[]) => {

      treeItem.expanded = true;
      treeItem.childrenLoaded = true;

      const idx = this.treeItems.findIndex(j => j.pid === treeItem.pid) + 1;

      const treeChildren: TreeDocumentItem[] = children.map(c => {
        const ti: TreeDocumentItem = <TreeDocumentItem>c;
        ti.level = treeItem.level + 1;
        ti.expandable = true;
        ti.parentPid = treeItem.pid;
        return ti;
      });

      if (children.length > 0) {
        this.treeMaxLevel = Math.max(treeItem.level + 1, this.treeMaxLevel);
      }

      this.treeItems.splice(idx, 0, ...treeChildren);

      this.refreshVisibleTreeItems();
      this.loadingTree = false;
      this.onTreeItemsChanged.emit(this.treeItems);
      if (getInfo) {
        this.getTreeInfo(treeItem);
      }
      if (callback) {
        callback(treeChildren)
      }
    });

  }

  getTreeInfo(treeItem: TreeDocumentItem) {
    const tree_info: { [model: string]: number } = {};
    let batchInfo: any = null;
    this.treeItems.filter(ti => ti.parentPid === treeItem.pid).forEach(t => {
      if (tree_info[t.model]) {
        tree_info[t.model]++;
      } else {
        tree_info[t.model] = 1;
      }
    });

    let params: any = {
      description: treeItem.pid,
    };

    this.api.getImportBatches(params).subscribe((resp: any) => {
      const batches = resp.data.map((d: any) => Batch.fromJson(d));
      if (batches.length > 0 && batches[0].failure) {
        batchInfo = batches[0].failure
      }
    });

    this.treeInfo.emit({ tree_info, batchInfo });
  }

  openTreeItem(event: MouseEvent, treeItem: TreeDocumentItem) {
    this.router.navigate(['/repository', treeItem.pid]);
  }

  selectTreeItem(event: MouseEvent, treeItem: TreeDocumentItem, idx: number) {


    if (event && (event.metaKey || event.ctrlKey)) {
      treeItem.selected = !treeItem.selected;
      this.startShiftClickIdxTree = idx;
    } else if (event && event.shiftKey) {
      if (this.startShiftClickIdxTree > -1) {
        const oldFrom = Math.min(this.startShiftClickIdxTree, this.lastClickIdxTree);
        const oldTo = Math.max(this.startShiftClickIdxTree, this.lastClickIdxTree);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.visibleTreeItems[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdxTree, idx);
        const to = Math.max(this.startShiftClickIdxTree, idx);
        for (let i = from; i <= to; i++) {
          this.visibleTreeItems[i].selected = true;
        }
      } else {
        // nic neni.
        this.visibleTreeItems.forEach(i => i.selected = false);
        treeItem.selected = true;
        this.startShiftClickIdxTree = idx;
      }
      window.getSelection().empty();
    } else {
      this.visibleTreeItems.forEach(i => i.selected = false);
      treeItem.selected = true;
      this.startShiftClickIdxTree = idx;
    }

    this.lastClickIdxTree = idx;
    this.totalSelectedTree = this.visibleTreeItems.filter(i => i.selected).length;
    this.selectedTreeItem = treeItem;
    this.onSelectTreeItem.emit(this.selectedTreeItem);

    if (this.totalSelectedTree === 1) {
      const allowedAsString: string = ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedTreeItem.model).join(',');
      const canHavePages = allowedAsString.includes('page');
      if (this.settings.searchExpandTree || !canHavePages) {
        if (treeItem.childrenLoaded) {

        } else {
          this.getTreeItems(treeItem, true);
        }
      }
      this.getTreeInfo(treeItem);
    } else {
      this.treeInfo.emit({ tree_info: {}, batchInfo: null });
    }
  }

  reloadTree(newPid: string) {
    // Kopirujeme objekt podrazeni ve stromu
    // this.selectItem(this.selectedItem);
    const parent = this.treeItems.find(ti => ti.pid === this.selectedTreeItem.parentPid);
    const parentIndex = this.treeItems.findIndex(ti => ti.pid === this.selectedTreeItem.parentPid);
    const numChildren = this.treeItems.filter(ti => ti.parentPid === parent.pid).length;
    // remove existing 
    this.treeItems.splice(parentIndex + 1, numChildren);
    this.getTreeItems(parent, true);
  }

  expandTreeDeep() {
    this.expandTreeItemDeep(this.treeItems[0]);
  }

  expandTreeItemDeep(treeItem: TreeDocumentItem) {
    treeItem.expanded = true;
    if (!treeItem.childrenLoaded) {
      this.getTreeItems(treeItem, false, (children: TreeDocumentItem[]) => {
        // callback
        children.forEach(ch => {
          this.expandTreeItemDeep(ch);
        });
      });
    } else {
      this.treeItems.filter(ti => ti.parentPid === treeItem.pid).forEach(t => {
        this.expandTreeItemDeep(t);
      });
    }

  }

}
