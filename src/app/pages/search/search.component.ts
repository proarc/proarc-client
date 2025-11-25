
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
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { UserTreeTableComponent } from "../../components/user-tree-table/user-tree-table.component";

// import { UserSettings } from '../../shared/user-settings';
// public settings: UserSettings
// form appearance implementation
// panelClass: ['app-dialog-new-object', 'app-form-view-' + this.settings.appearance]

@Component({
  selector: 'app-search',
  imports: [TranslateModule, FormsModule, AngularSplitModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatSortModule, SearchActionsComponent, UserTableComponent, UserTreeTableComponent],
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


  @ViewChild('treeTable') treeTable: UserTreeTableComponent;
  loadingTree: boolean;

  treeItems: TreeDocumentItem[] = [];
  selectedTreeItem: TreeDocumentItem;
  selectedRootTreeItem: TreeDocumentItem;
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
    public ui: UIService) {
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
    this.settings.searchModel = this.model;
    if (this.owner) {
      this.settings.searchOwner = this.owner;
    }
    if (this.organization) {
      this.settings.searchOrganization = this.organization;
    }
    if (this.processor) {
      this.settings.searchProcessor = this.processor;
    }

    
    
    this.settingsService.save();
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

  onPageChanged(page: any) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  sortBy(e: Sort) {
    this.sortField = e.active;
    this.sortAsc = e.direction === 'asc';
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
    this.selectedRootTreeItem = null;
    this.treeItems = [];
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


  reload(selectedPid: string = null) {
    this.clearSelection();
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

  expandAllInTree() {
    this.treeTable.expandTreeDeep();
  }

  reloadTree(newPid: string) {
    if (this.selectedRootTreeItem.model === this.model) {
      this.reload(newPid);
    } else {
      this.treeTable.reloadTree(newPid);
      this.selectedItem.selected = true;
      this.totalSelected = 1;
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

    if (this.selectedRootTreeItem) {
      // reset
      this.selectedRootTreeItem.expanded = false;
      this.selectedRootTreeItem.childrenLoaded = false;
    }

    this.selectedRootTreeItem = <TreeDocumentItem>this.selectedItem;
    this.selectedRootTreeItem.level = 0;
    this.selectedRootTreeItem.expandable = true;
    this.selectedTreeItem = this.selectedRootTreeItem;
    this.treeItems = [this.selectedRootTreeItem];
    
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
    this.dialog.open(LogDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-log', 'app-form-view-' + this.settings.appearance]
    });
  }

  treeInfoChanged(info: {tree_info: { [model: string]: number }, batchInfo: any}) {
    this.tree_info = info.tree_info;
    this.batchInfo = info.batchInfo;
  }

  onSelectTreeItem(item: any) {
    this.selectedTreeItem = item;
  }

  onTreeItemsChanged(items: any[]) {
    this.treeItems = items
  }

}
