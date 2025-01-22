import { CommonModule } from '@angular/common';
import { Component, inject, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Configuration } from '../../shared/configuration';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { AngularSplitModule } from 'angular-split';
import { of, switchMap, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../../model/user.model';
import { DocumentItem, TreeDocumentItem } from '../../model/documentItem.model';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ModelTemplate } from '../../model/modelTemplate';
import { Batch } from '../../model/batch.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ResizecolDirective } from '../../resizecol.directive';
import { Clipboard } from '@angular/cdk/clipboard';
import { LogDialogComponent } from '../../dialogs/log-dialog/log-dialog.component';
import { SearchActionsComponent } from "./search-actions/search-actions.component";
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { UserTableComponent } from "../../components/user-table/user-table.component";

@Component({
  selector: 'app-search',
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule, FlexLayoutModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule,
    MatTableModule, MatSortModule, ResizecolDirective, SearchActionsComponent, UserTableComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  state: string;
  splitArea1Width: number;
  splitArea2Width: number;

  // Search params
  urlParams: any;
  searchMode: string = 'advanced';
  model: string;
  query = '';
  queryField: string;
  queryLabel: string;
  queryIdentifier: string;
  queryCreator: string
  queryModel: string;
  organization: string;
  owner: string;
  processor: string;
  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;
  sortField: string;
  sortAsc: boolean;

  users: User[];

  @ViewChild('table') table: MatTable<DocumentItem>;
  @ViewChildren('matrow', { read: ViewContainerRef }) rows: QueryList<ViewContainerRef>;

  displayedColumns: string[] = [];
  colsWidth: { [key: string]: string } = {};

  items: DocumentItem[];
  selectedItem: DocumentItem;
  startShiftClickIdx: number;
  lastClickIdx: number;
  totalSelected: number;


  @ViewChild('treeTable') treeTable: MatTable<any>;
  loadingTree: boolean;

  treeColumnsSizes: { [key: string]: string } = {};
  treeColumns = ['taskUsername', 'label', 'profileName'];

  treeItems: TreeDocumentItem[] = [];
  visibleTreeItems: TreeDocumentItem[] = [];
  selectedTreeItem: TreeDocumentItem;
  startShiftClickIdxTree: number;
  lastClickIdxTree: number;
  totalSelectedTree: number;
  treeMaxLevel = 0;
  object = Object; // Allow use Object.keys in template
  tree_info: { [model: string]: number } = {};
  batchInfo: any;

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
    private ui: UIService,
    private clipboard: Clipboard) {
  }

  ngOnInit() {

    this.splitArea1Width = this.settings.searchSplit;
    this.splitArea2Width = 100 - this.splitArea1Width;
    // this.route.queryParams.subscribe(p => {
    const s = this.route.queryParams.pipe(
      switchMap(p => {
        this.processParams(p);
        this.urlParams = p;
        this.reload();
        return of(true);
      })
    );
    s.subscribe();
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  processParams(p: any) {
    this.searchMode = p['type'] ? p['type'] : 'advanced';
    this.model = p['model'] ? p['model'] : this.settings.searchModel;
    this.organization = p['organization'] ? p['organization'] : this.settings.searchOrganization;
    this.query = p['query'] ? p['query'] : null;
    this.queryField = p['queryField'] ? p['queryField'] : this.settings.searchQueryField;
    this.queryLabel = p['queryLabel'] ? p['queryLabel'] : null;
    this.queryIdentifier = p['queryIdentifier'] ? p['queryIdentifier'] : null;
    this.queryCreator = p['queryCreator'] ? p['queryCreator'] : null;
    this.pageIndex = p['pageIndex'] ? p['pageIndex'] : null;
    this.owner = p['owner'] ? p['owner'] : this.settings.searchOwner;
    this.processor = p['processor'] ? p['processor'] : this.settings.searchProcessor;
    this.sortField = p['sortField'] ? p['sortField'] : this.settings.searchSortField;
    this.sortAsc = p['sortAsc'] ? (p['sortAsc'] === 'true') : this.settings.searchSortAsc;
  }

  filter() {
    const params = {
      type: this.searchMode,
      model: this.model,
      organization: this.organization,
      query: this.query,
      queryField: this.queryField,
      queryLabel: this.queryLabel,
      queryIdentifier: this.queryIdentifier,
      queryCreator: this.queryCreator,
      page: this.pageIndex,
      owner: this.owner || null,
      processor: this.processor,
      sortField: this.sortField,
      sortAsc: this.sortAsc
    }
    params.page = null;
    this.settingsService.save();
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

  onPageChanged(page: any) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  sortTable(sortState: Sort) {
    this.sortBy(sortState.active);
  }

  sortBy(field: string) {
    // if (this.query) {
    //   return;
    // }
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortAsc = true;
    }
    this.sortField = field;
    this.settings.searchSortField = this.sortField;
    this.settings.searchSortAsc = this.sortAsc;
    this.settingsService.save();

    const params = {
      sortField: this.sortField,
      sortAsc: this.sortAsc,
      page: 0
    }
    params.page = null;
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }


  clearSelection() {
    this.lastClickIdx = -1;
    this.totalSelected = 0;
    this.selectedItem = null;
    this.selectedTreeItem = null;
    this.treeItems = [];

    this.refreshVisibleTreeItems();
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

  reload(selectedPid: string = null) {
    this.clearSelection();
    this.initSelectedColumns();
    this.state = 'loading';
    const options = {
      type: this.searchMode,
      model: this.model,
      organization: this.organization,
      query: this.query,
      queryField: this.queryField,
      queryLabel: this.queryLabel,
      queryIdentifier: this.queryIdentifier,
      queryCreator: this.queryCreator,
      page: this.pageIndex,
      owner: this.owner,
      processor: this.processor,
      sortField: this.sortField,
      sortAsc: this.sortAsc
    }

    this.api.getSearchResults(options).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      if (this.items.length > 0) {
        if (selectedPid) {
          // this.selectItem(this.findItem(selectedPid));
          const idx = this.items.findIndex(it => it.pid === selectedPid);
          this.selectItem(this.items[idx]);
          setTimeout(() => {
            let row = this.rows.find(tr => tr.element.nativeElement.id === 'tr_' + idx);
            if (row) {
              row.element.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          }, 500);

        } else {
          this.selectItem(this.items[0]);
        }

      }
      this.state = 'success';

    });
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
      if (getInfo) {
        this.getTreeInfo(treeItem);
      }
      if (callback) {
        callback(treeChildren)
      }
    });

  }

  getTreeInfo(treeItem: TreeDocumentItem) {
    this.tree_info = {};
    this.batchInfo = null;
    //setTimeout(() => { 
    this.treeItems.filter(ti => ti.parentPid === treeItem.pid).forEach(t => {
      if (this.tree_info[t.model]) {
        this.tree_info[t.model]++;
      } else {
        this.tree_info[t.model] = 1;
      }
    });

    let params: any = {
      description: treeItem.pid,
    };

    this.api.getImportBatches(params).subscribe((resp: any) => {
      const batches = resp.data.map((d: any) => Batch.fromJson(d));
      if (batches.length > 0 && batches[0].failure) {
        this.batchInfo = batches[0].failure
      }
    });

    //}, 2000)
  }

  refreshVisibleTreeItems() {
    this.visibleTreeItems = this.treeItems.filter(j => !j.hidden);
    if (this.treeTable) {
      this.treeTable.renderRows();
    }

  }

  expandAllInTree() {
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

  reloadTree(newPid: string) {
    if (this.selectedTreeItem.model === this.model) {
      this.reload(newPid);
    } else {
      // Kopirujeme objekt podrazeni ve stromu
      // this.selectItem(this.selectedItem);
      const parent = this.treeItems.find(ti => ti.pid === this.selectedTreeItem.parentPid);
      const parentIndex = this.treeItems.findIndex(ti => ti.pid === this.selectedTreeItem.parentPid);
      const numChildren = this.treeItems.filter(ti => ti.parentPid === parent.pid).length;
      // remove existing 
      this.treeItems.splice(parentIndex + 1, numChildren);
      this.getTreeItems(parent, true);

      this.selectedItem.selected = true;
      this.totalSelected = 1;
    }
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


  splitDragEnd(e: any) {
    this.settings.searchSplit = e.sizes[0];
    this.settingsService.save();
  }

  // Actions


  openItem(item: DocumentItem) {
    this.router.navigate(['/repository', item.pid]);
  }

  selectRow(e: {item: DocumentItem, event?: MouseEvent, idx?: number}) {
    this.selectItem(e.item, e.event, e.idx);
  }
  selectItem(item: DocumentItem, event?: MouseEvent, idx?: number) {
    if (event && (event.metaKey || event.ctrlKey)) {
      item.selected = !item.selected;
      this.startShiftClickIdx = idx;
    } else if (event && event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.items[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, idx);
        const to = Math.max(this.startShiftClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.items[i].selected = true;
        }
      } else {
        // nic neni.
        this.items.forEach(i => i.selected = false);
        item.selected = true;
        this.startShiftClickIdx = idx;
      }
      window.getSelection().empty();
    } else {
      this.items.forEach(i => i.selected = false);
      item.selected = true;
      this.startShiftClickIdx = idx;
    }

    this.lastClickIdx = idx;
    this.totalSelected = this.items.filter(i => i.selected).length;
    this.selectedItem = item;


    if (this.selectedTreeItem) {
      // reset
      this.selectedTreeItem.expanded = false;
      this.selectedTreeItem.childrenLoaded = false;

    }

    this.selectedTreeItem = <TreeDocumentItem>this.selectedItem;
    this.selectedTreeItem.level = 0;
    this.selectedTreeItem.expandable = true;
    this.treeItems = [this.selectedTreeItem];

    this.refreshVisibleTreeItems();
    const allowedAsString: string = ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedTreeItem.model).join(',');
    const canHavePages = allowedAsString.includes('page');
    if (this.settings.searchExpandTree || !canHavePages) {
      this.getTreeItems(this.selectedTreeItem, true);
    }
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
      this.tree_info = {};
      this.batchInfo = null;
    }
  }

  getValidationError(id: string) {
    let params: any = {
      batchId: id,
    };
    this.api.getImportBatches(params).subscribe((resp: any) => {
      const batches = resp.data.map((d: any) => Batch.fromJson(d));
      if (batches.length > 0 && batches[0].failure) {
        this.onShowLog(batches[0].failure)
      }
    });
  }

  onShowLog(info: string) {
    const data = {
      content: info
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

  copyTextToClipboard(val: string) {
    this.clipboard.copy(val);
    this.ui.showInfoSnackBar(this.translator.instant('snackbar.copyTextToClipboard.success'));
  }

}
