import { DocumentItem } from '../../model/documentItem.model';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { ExportDialogComponent } from 'src/app/dialogs/export-dialog/export-dialog.component';
import { UrnnbnDialogComponent } from 'src/app/dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tree } from 'src/app/model/mods/tree.model';
import { UIService } from 'src/app/services/ui.service';
import { ChangeModelDialogComponent } from 'src/app/dialogs/change-model-dialog/change-model-dialog.component';

import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ConvertDialogComponent } from 'src/app/dialogs/convert-dialog/convert-dialog.component';
import { LayoutService } from 'src/app/services/layout.service';
import { CzidloDialogComponent } from 'src/app/dialogs/czidlo-dialog/czidlo-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { UpdateInSourceDialogComponent } from 'src/app/dialogs/update-in-source-dialog/update-in-source-dialog.component';
import { Subscription } from 'rxjs';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { Batch } from 'src/app/model/batch.model';
import { LogDialogComponent } from 'src/app/dialogs/log-dialog/log-dialog.component';
import { ColumnsSettingsDialogComponent } from 'src/app/dialogs/columns-settings-dialog/columns-settings-dialog.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  //@ViewChild('split') split: SplitComponent;
  // @ViewChild('area1') area1: SplitAreaDirective;
  // @ViewChild('area2') area2: SplitAreaDirective;
  @ViewChild('modelSelect') modelSelect: MatSelect;
  @ViewChild('scroll') scroll: ElementRef;

  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;

  splitArea1Width: number;
  splitArea2Width: number;

  state = 'none';
  items: DocumentItem[];

  selectedItem: DocumentItem;

  tree: Tree;

  models: string[]

  model: string;
  query = '';
  queryField: string;

  queryLabel: string;
  queryIdentifier: string;
  queryCreator: string

  organization: string;
  owner: string;
  processor: string;


  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  sortField: string;
  sortAsc: boolean;

  organizations: string[];
  users: User[];

  searchMode: string = 'advanced';

  public urlParams: any;

  startShiftClickIdx: number;
  lastClickIdx: number;
  totalSelected: number;

  startShiftClickIdxTree: number;
  lastClickIdxTree: number;
  totalSelectedTree: number;

  loadingTree: boolean;


  @ViewChild('table') table: MatTable<DocumentItem>;
  @ViewChildren('matrow', { read: ViewContainerRef }) rows: QueryList<ViewContainerRef>;

  selectedColumnsDefs: { field: string, selected: boolean, type: string, width: number }[];
  displayedColumns: string[] = [];
  colsWidth: { [key: string]: string } = {};

  isAkubra: boolean;
  subscriptions: Subscription[] = [];

  object = Object;
  tree_info: { [model: string]: number } = {};

  constructor(private api: ApiService,
    private translator: TranslateService,
    public properties: LocalStorageService,
    public auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    // public search: SearchService,
    public config: ConfigService,
    private ui: UIService,
    public layout: LayoutService,
    private clipboard: Clipboard) {
    this.models = this.config.allModels;
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.splitArea1Width = parseInt(this.properties.getStringProperty('search.split.0', "60"));
    this.splitArea2Width = 100 - this.splitArea1Width;
    this.organizations = this.config.organizations;
    this.initSelectedColumns();
    this.route.queryParams.subscribe(p => {
      this.processParams(p);
      this.reload();
      this.urlParams = p;
    });

    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });

    this.api.getInfo().subscribe((info) => {
      this.isAkubra = info.storage === 'Akubra';
    });

    this.subscriptions.push(this.ui.refresh.subscribe(v => {
      this.reload();
    }));
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
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

  // todo - Alberto jeste predela
  removeActiveFilter(filter: any) {
    this[filter as keyof SearchComponent] = '' as never;
    this.filter();
  }


  processParams(p: any) {

    //this.searchMode  = p['description'] ? p['description'] : 'advanced';
    this.searchMode = p['type'] ? p['type'] : 'advanced';
    this.model = p['model'] ? p['model'] : this.properties.getStringProperty('search.model', this.config.defaultModel);
    this.organization = p['organization'] ? p['organization'] : this.properties.getStringProperty('search.organization', '-');
    this.query = p['query'] ? p['query'] : null;
    this.queryField = p['queryField'] ? p['queryField'] : this.properties.getStringProperty('search.query_field', 'queryLabel');
    this.queryLabel = p['queryLabel'] ? p['queryLabel'] : null;
    this.queryIdentifier = p['queryIdentifier'] ? p['queryIdentifier'] : null;
    this.queryCreator = p['queryCreator'] ? p['queryCreator'] : null;
    this.pageIndex = p['pageIndex'] ? p['pageIndex'] : null;
    this.owner = p['owner'] ? p['owner'] : this.properties.getStringProperty('search.owner', '-');
    this.processor = p['processor'] ? p['processor'] : this.properties.getStringProperty('search.processor', '-');
    this.sortField = p['sortField'] ? p['sortField'] : this.properties.getStringProperty('search.sort_field', 'created');
    // this.sortField = p['sortField'] ? p['sortField'] : 'created';
    this.sortAsc = p['sortAsc'] ? (p['sortAsc'] === 'true') : this.properties.getBoolProperty('search.sort_asc', false);
    // this.sortAsc = p['sortAsc'] ? p['sortAsc'] : false;


  }


  dragEnd(e: any) {
    // this.splitArea1Width = e.sizes[0];
    // this.splitArea2Width = e.sizes[1];
    this.properties.setStringProperty('search.split.0', String(e.sizes[0]));
    this.properties.setStringProperty('search.split.1', String(e.sizes[1]));
  }

  reload(selectedPid: string = null) {
    this.clearSelection();
    this.initSelectedColumns();
    if (this.model !== 'all') {
      // nechceme all
      this.properties.setStringProperty('search.model', this.model);
    }
    this.properties.setStringProperty('search.query_field', this.queryField);
    this.properties.setStringProperty('search.organization', this.organization);
    this.properties.setStringProperty('search.owner', this.owner);
    this.properties.setStringProperty('search.processor', this.processor);
    // this.pageIndex = page;
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

    this.tree = undefined;

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

  openItem(item: DocumentItem) {
    this.router.navigate(['/repository', item.pid]);
  }

  clearSelection() {
    this.lastClickIdx = -1;
    this.totalSelected = 0;
    this.selectedItem = null;
    this.selectedTreeItem = null;
    this.treeItems = [];

    this.refreshVisibleTreeItems();
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
    const allowedAsString: string = ModelTemplate.allowedChildrenForModel(this.config.allModels,this.selectedTreeItem.model).join(',');
    const canHavePages = allowedAsString.includes('page');
    if (this.properties.getBoolProperty('searchExpandTree', true) || !canHavePages) {
      this.getTreeItems(this.selectedTreeItem, true);
    }
  }

  findItem(pid: string) {
    return this.items.find(item => item.pid === pid)
  }

  onExpandAll() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.expandAll.title')),
      message: String(this.translator.instant('dialog.expandAll.message')),
      alertClass: 'app-info',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.expandAll();
      }
    });
  }

  private expandAll() {
    // this.search.selectedTree.expandAll(this.api);
  }

  onPageChanged(page: any) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  onUrnnbn(inSearch: boolean) {
    const pids = inSearch ?
      this.items.filter(i => i.selected).map(i => i.pid) :
      [this.selectedTreeItem.pid];
    const dialogRef = this.dialog.open(UrnnbnDialogComponent, {
      data: pids,
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onExport(inSearch: boolean) {
    const items = inSearch ?
      this.items.filter(i => i.selected).map(i => { return { pid: i.pid, model: i.model } }) :
      [{ pid: this.selectedTreeItem.pid, model: this.selectedTreeItem.model }];
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      disableClose: true,
      data: items,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onDeleteItem() {
    const pids = this.items.filter(i => i.selected).map(i => i.pid)
    this.onDelete(pids, true, (pids: string[]) => {
      for (let i = this.items.length - 1; i >= 0; i--) {
        if (pids.indexOf(this.items[i].pid) > -1) {
          this.items.splice(i, 1);
        }
      }
    });
  }

  showFoxml(item: DocumentItem) {
    window.open(this.api.getApiUrl() + 'object/dissemination?pid=' + item.pid, 'foxml');
  }

  onRestore(item: DocumentItem) {

    const data: SimpleDialogData = {
      title: String(this.translator.instant('Obnovit objekt')),
      message: String(this.translator.instant('Opravdu chcete vybrané objekty obnovit?')),
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
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.api.restoreObject(item.pid, false, false).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            this.state = 'error';
            return;
          } else {
            this.ui.showInfoSnackBar('Objekt byl úspěšně obnoven');
            this.reload();
          }

        });

      }
    });
  }

  onLock(item: DocumentItem, lock: boolean) {
    const data: SimpleDialogData = {
      title: lock ? String(this.translator.instant('dialog.lockObject.title')) : String(this.translator.instant('dialog.unlockObject.title')),
      message: lock ? String(this.translator.instant('dialog.lockObject.message')) : String(this.translator.instant('dialog.unlockObject.message')),
      alertClass: 'app-info',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: data,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (lock) {
          this.lockObject(item);
        } else {
          this.unlockObject(item);
        }

      }
    });
  }

  changeLockInTree(item: TreeDocumentItem, isLocked: boolean, idx: number) {
    for (let i = idx; i < this.treeItems.length; i++) {
      const j = this.treeItems[i]
      if (j.parentPid === item.pid) {
        j.isLocked = isLocked;
        this.changeLockInTree(j, isLocked, i)
      }
    }
  }

  lockObject(item: DocumentItem) {
    this.api.lockObjects([item.pid], item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.search.lockObject')));
        item.isLocked = true;
        const treeItem = this.treeItems.find(it => it.pid === item.pid);
        if (treeItem) {
          this.changeLockInTree(treeItem, true, this.treeItems.indexOf(treeItem));
        }

      }

    });
  }

  unlockObject(item: DocumentItem) {
    this.api.unlockObjects([item.pid], item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.search.unlockObject')));
        item.isLocked = false;
        const treeItem = this.treeItems.find(it => it.pid === item.pid);
        if (treeItem) {
          this.changeLockInTree(treeItem, false, this.treeItems.indexOf(treeItem));
        }
      }
    });
  }

  onCopyItem(treeItem: TreeDocumentItem) {
    this.state = 'loading';
    this.api.copyObject(treeItem.pid, treeItem.model).subscribe((response: any) => {

      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else if (response.response.data && response.response.data[0].validation) {
        this.ui.showErrorDialogFromObject(response.response.data.map((d: any) => d.errorMessage = d.validation));
        this.state = 'error';
      } else {
        const newPid = response.response.data[0].pid;
        this.state = 'success';
        this.ui.showInfoSnackBar("Objekty byly zkopirovane");
        if (treeItem.model === this.model) {
          this.reload(newPid);
        } else {
          // Kopirujeme objekt podrazeni ve stromu
          // this.selectItem(this.selectedItem);
          const parent = this.treeItems.find(ti => ti.pid === treeItem.parentPid);
          const parentIndex = this.treeItems.findIndex(ti => ti.pid === treeItem.parentPid);
          const numChildren = this.treeItems.filter(ti => ti.parentPid === parent.pid).length;
          // remove existing 
          this.treeItems.splice(parentIndex + 1, numChildren);
          this.getTreeItems(parent, true);

          this.selectedItem.selected = true;
          this.totalSelected = 1;


        }

      }
    }, error => {
      console.log(error);
      this.ui.showInfoSnackBar(error.statusText);
      this.state = 'error';
    });
  }

  onDeleteFromTree() {
    const refresh = this.selectedTreeItem.parent ? false : true;
    const pids = this.visibleTreeItems.filter(i => i.selected).map(i => i.pid)
    this.onDelete(pids, true, (pids: string[]) => {
      // this.search.selectedTree.remove();
    });
  }

  private onDelete(pids: string[], refresh: boolean, callback: (pids: string[]) => any = null) {
    const checkbox = {
      label: String(this.translator.instant('dialog.removeObject.checkbox')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.removeObject.title')),
      message: String(this.translator.instant('dialog.removeObject.message')) + ": " + pids.length + '?',
      alertClass: 'app-warn',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      },
      // checkbox: this.auth.isSuperAdmin() ? checkbox : undefined
    };
    if (this.auth.isSuperAdmin()) {
      data.checkbox = checkbox;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: data,
      //width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteObject(pids, checkbox.checked, refresh, callback);
      }
    });
  }

  private deleteObject(pids: string[], pernamently: boolean, refresh: boolean, callback: (pids: string[]) => any = null) {
    this.state = 'loading';
    this.api.deleteObjects(pids, pernamently).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        const removedPid: string[] = response['response']['data'].map((x: any) => x.pid);
        if (callback) {
          callback(removedPid);
        }
        this.state = 'success';
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.removeObject.success')));
        if (refresh) {
          this.reload();
        }

      }
    });
  }


  getSortIcon(field: string) {
    // if (this.query) {
    //   return;
    // }
    if (this.sortField === field) {
      if (this.sortAsc) {
        return 'arrow_drop_up';
      } else {
        return 'arrow_drop_down';
      }
    }
    return '';
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
    this.properties.setStringProperty('search.sort_field', this.sortField);
    this.properties.setBoolProperty('search.sort_asc', this.sortAsc);
    // this.reload();

    const params = {
      sortField: this.sortField,
      sortAsc: this.sortAsc,
      page: 0
    }
    params.page = null;
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

  canCopy(item: DocumentItem): boolean {
    return this.config.allowedCopyModels.includes(item.model)
  }

  enterModel(e: any) {
    this.modelSelect.close();
    this.reload();
  }

  openFromTree(item: DocumentItem) {
    this.router.navigate(['/repository', item.pid]);
  }

  selectFromTree(tree: Tree) {
    // this.search.selectedTree = tree;
    // this.search.selectedTreePid = tree.item.pid;
    // this.tree_info = {};
    // this.search.selectedTree.children.forEach(t => {
    //   if (this.tree_info[t.item.model]) {
    //     this.tree_info[t.item.model]++;
    //   } else {
    //     this.tree_info[t.item.model] = 1;
    //   }

    // })
  }

  canChangeModel(item: DocumentItem): boolean {
    return this.config.modelChanges.findIndex(m => ('model:' + m.origin).toLocaleLowerCase() === item.model.toLocaleLowerCase()) > -1
  }

  changeModel(item: DocumentItem) {
    const dialogRef = this.dialog.open(ChangeModelDialogComponent, {
      data: {
        pid: item.pid,
        model: item.model,
        dest: this.config.modelChanges.find(m => ('model:' + m.origin).toLocaleLowerCase() === item.model.toLocaleLowerCase()).dest
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  updateObjects(item: DocumentItem) {
    this.state = 'loading';
    this.api.updateObjects(item.pid, item.model).subscribe((response: any) => {
      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar(this.translator.instant('snackbar.updateObjects.success'))
      }
    });
  }

  setColumns() {
    this.displayedColumns = this.selectedColumnsDefs.filter(c => c.selected).map(c => c.field);

    // this.treeColumns = this.treeColumnsDefs.filter(c => c.selected).map(c => c.field);
    this.displayedColumns.forEach(c => {
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnType(c);
      this.prefixes[c] = this.prefixByType(c);

    });
    this.setColumnsWith();

    
  }

  setColumnsWith() {
    this.colsWidth = {};
    this.selectedColumnsDefs.forEach(c => {
      this.colsWidth[c.field] = c.width + 'px';
    });
  }


  initSelectedColumns() {
    this.selectedColumnsDefs = this.properties.getSearchColumns();
    this.treeColumnsDefs = this.properties.getSearchColumnsTree();
    this.setColumns();
    this.setSelectedTreeColumns();
  }

  setSelectedColumns() {
    this.properties.setStringProperty('searchColumns', JSON.stringify(this.selectedColumnsDefs));
    this.initSelectedColumns();
    this.table.renderRows();
  }

  

  getColumnWidth(field: string) {

    const el = this.selectedColumnsDefs.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizes(e: any, field?: string) {
    const el = this.selectedColumnsDefs.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.properties.setStringProperty('searchColumns', JSON.stringify(this.selectedColumnsDefs));
  }



  showConvertDialog(item: DocumentItem) {
    const dialogRef = this.dialog.open(ConvertDialogComponent, {
      data: { pid: item.pid, model: item.model }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.status == 'ok') {
          this.layout.setShouldRefresh(false);
          this.ui.showInfoSnackBar(this.translator.instant('snackbar.convertPages.success'));

        } else if (result.status == 'failure') {
          this.layout.setShouldRefresh(false);
          this.ui.showInfoSnackBar(this.translator.instant('snackbar.convertPages.failure'));
        }
      }
    });
  }

  czidlo(item: DocumentItem) {
    const dialogRef = this.dialog.open(CzidloDialogComponent, {
      data: { pid: item.pid, model: item.model },
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  canUpdateInSource(item: DocumentItem) {
    return this.config.updateInSourceModels.includes(item.model)
  }

  updateInSource(item: DocumentItem) {

    const dialogRef = this.dialog.open(UpdateInSourceDialogComponent, {
      data: item.pid,
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  reindex(item: DocumentItem) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Index Proarc')),
      message: String(this.translator.instant('Opravdu chcete spustit index?')),
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
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.api.indexer().subscribe((response: any) => {
          if (response.response.errors) {
            this.state = 'error';
            this.ui.showErrorDialogFromObject(response.response.errors);
          } else {
            this.state = 'success';
            this.ui.showInfoSnackBar(this.translator.instant('index Proarc spusten'))
          }
        });
      }
    });
  }

  copyTextToClipboard(val: string) {
    this.clipboard.copy(val);
    this.ui.showInfoSnackBar(this.translator.instant('snackbar.copyTextToClipboard.success'));
  }



  validateObject(item: DocumentItem) {
    this.api.validateObject(item.pid).subscribe((response: any) => {
      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar(response.response.data[0].msg)
      }
    });
  }

  // Tree methods
  @ViewChild('treeTable') treeTable: MatTable<any>;

  treeItems: TreeDocumentItem[] = [];
  visibleTreeItems: TreeDocumentItem[] = [];
  treeColumnsDefs: { field: string, selected: boolean, type: string, width: number }[];
  treeColumnsSizes: { [key: string]: string } = {};
  treeColumns = ['taskUsername', 'label', 'profileName'];

  columnTypes: { [field: string]: string } = {};
  lists: { [field: string]: { code: string, value: string }[] } = {};
  prefixes: { [field: string]: string } = {};

  treeMaxLevel = 0;

  selectedTreeItem: TreeDocumentItem;
  batchInfo: any;

  statuses = [
    "undefined",
    "new",
    "assign",
    "connected",
    "processing",
    "described",
    "exported"]

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
      const allowedAsString: string = ModelTemplate.allowedChildrenForModel(this.config.allModels,this.selectedTreeItem.model).join(',');
      const canHavePages = allowedAsString.includes('page');
      if (this.properties.getBoolProperty('searchExpandTree', true) || !canHavePages) {
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

  onShowLog(info: string) {
    const data = {
      content: info
    }
    this.dialog.open(LogDialogComponent, { data: data });
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

  columnType(f: string) {
    return this.treeColumnsDefs.find(c => c.field === f).type;
  }

  prefixByType(f: string): string {
    switch (f) {
      case 'status': return 'editor.atm.statuses.';
      case 'model': return 'model.';
      default: return '';
    }
  }

  setSelectedTreeColumns() {
    this.treeColumns = this.treeColumnsDefs.filter(c => c.selected).map(c => c.field);
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
    this.treeColumnsDefs.forEach((c: any) => {
      this.treeColumnsSizes[c.field] = c.width + 'px';
    });
  }

  saveTreeColumnsSizes(e: any, field?: string) {
    this.treeColumnsSizes[field] = e + 'px';
    // this.treeColumnsDefs.find(c => c.field === field).width = e;

    this.treeColumnsDefs.forEach((c: any) => {
      c.width = parseInt(this.treeColumnsSizes[c.field]);
    });

    this.properties.setSelectedColumnsSearchTree(this.treeColumnsDefs);

  }

  getList(f: string): { code: string, value: string }[] {
    switch (f) {
      case 'status': return this.statuses.map((p: string) => { return { code: p, value: this.translator.instant('editor.atm.statuses.' + p) } });
      case 'model': return this.models.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
      default: return [];
    }
  }

  listValue(field: string, code: string) {
    const el = this.lists[field].find(el => el.code === code + '');
    return el ? el.value : code;
  }

  selectColumnsTree(type: string) {
    const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
      data: {
        type: type,
        isRepo: false,
        isImport: false
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (type) {
          case 'searchTree':
            this.treeColumnsDefs = this.properties.getSearchColumnsTree();
            this.setSelectedTreeColumns();
            break;
          default:

        }

      }
    });
  }

}

export interface TreeDocumentItem extends DocumentItem {
  parentPid?: string;
  level: number;
  expandable: boolean;
  expanded: boolean;
  childrenLoaded: boolean;
  hidden: boolean;
}
