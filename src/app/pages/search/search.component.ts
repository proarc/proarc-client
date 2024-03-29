import { DocumentItem } from '../../model/documentItem.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { Tree } from 'src/app/model/mods/tree.model';
import { SearchService } from 'src/app/services/search.service';
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

  public urlParams: any; // pedro


  @ViewChild('table') table: MatTable<DocumentItem>;
  public selectedColumns = [
    { field: 'label', selected: true, width: 100 },
    { field: 'model', selected: true, width: 100 },
    { field: 'pid', selected: true, width: 100 },
    { field: 'processor', selected: true, width: 100 },
    { field: 'organization', selected: true, width: 100 },
    { field: 'status', selected: true, width: 100 },
    { field: 'created', selected: true, width: 100 },
    { field: 'modified', selected: true, width: 100 },
    { field: 'owner', selected: true, width: 100 },
    { field: 'export', selected: true, width: 100 },
    { field: 'isLocked', selected: true, width: 100 }
  ];

  displayedColumns: string[] = [];
  colsWidth: { [key: string]: string } = {};

  isAkubra: boolean;
  subscriptions: Subscription[] = [];

  constructor(private api: ApiService,
    public properties: LocalStorageService,
    public auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public search: SearchService,
    public config: ConfigService,
    private ui: UIService,
    private translator: TranslateService,
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
      // if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      //   this.reload();
      // } else {
      //   this.state = 'success';
      // }

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

  // getSplitSize(split: number): number {
  //   if (split == 0) {
  //     return parseInt(this.splitArea1Width);
  //   }
  //   return parseInt(this.splitArea2Width);
  // }

  reload(selectedPid: string = null) {
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
          this.selectItem(this.findItem(selectedPid));
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

  selectItem(item: DocumentItem) {
    this.selectedItem = item;
    this.tree = new Tree(item);
    this.search.selectedTree = this.tree;
    this.tree.expand(this.api, false);
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
    this.search.selectedTree.expandAll(this.api);
  }

  onPageChanged(page: any) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  onUrnnbn(item: DocumentItem) {
    const dialogRef = this.dialog.open(UrnnbnDialogComponent, {
      data: item.pid,
      panelClass: 'app-urnbnb-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onExport(item: DocumentItem) {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      disableClose: true,
      data: { pid: item.pid, model: item.model },
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onDeleteItem() {
    this.onDelete(this.selectedItem, true, (pids: string[]) => {
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

  changeLockInTree(tree: Tree, isLocked: boolean) {
    //tree.children.map(ch => ch.item.isLocked = isLocked);
    if (tree.children && tree.children.length > 0) {
      tree.children.forEach(ch => {
        ch.item.isLocked = isLocked;
        this.changeLockInTree(ch, isLocked);
      });
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
        this.changeLockInTree(this.search.selectedTree, true);
        // this.search.selectedTree.children.map(ch => ch.item.isLocked = true);
        //this.reload(item.pid);
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
        this.changeLockInTree(this.search.selectedTree, false);
        //this.search.selectedTree.children.map(ch => ch.item.isLocked = false);
        // this.reload(item.pid);
      }
    });
  }

  onCopyItem(item: DocumentItem) {
    this.api.copyObject(item.pid, item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else if (response.response.data && response.response.data[0].validation) {
        this.ui.showErrorDialogFromObject(response.response.data.map((d: any) => d.errorMessage = d.validation));
        this.state = 'error';
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar("Objekty byly zkopirovane");
        if (item.model === this.model) {
          const idx = this.items.findIndex(it => it.pid === item.pid) + 1;
          this.items.splice(idx, 0, DocumentItem.fromJson(response.response.data[0]));
          this.selectItem(this.items[idx]);
          // setTimeout(()=>{
          //   this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
          // }, 50);
        } else {
          // Kopirujeme objekt podrazeni ve stromu
          this.selectItem(this.selectedItem);
        }

      }
    }, error => {
      console.log(error);
      this.ui.showInfoSnackBar(error.statusText);
      this.state = 'error';
    });
  }

  onDeleteFromTree() {
    const refresh = this.search.selectedTree.item.parent ? false : true;
    this.onDelete(this.search.selectedTree.item, refresh, (pids: string[]) => {
      this.search.selectedTree.remove();
    });
  }

  private onDelete(item: DocumentItem, refresh: boolean, callback: (pids: string[]) => any = null) {
    const checkbox = {
      label: String(this.translator.instant('dialog.removeObject.checkbox')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.removeObject.title')),
      message: String(this.translator.instant('dialog.removeObject.message')),
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
        this.deleteObject(item, checkbox.checked, refresh, callback);
      }
    });
  }

  private deleteObject(item: DocumentItem, pernamently: boolean, refresh: boolean, callback: (pids: string[]) => any = null) {
    this.state = 'loading';
    this.api.deleteObjects([item.pid], pernamently).subscribe((response: any) => {
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
    this.search.selectedTree = tree;
    this.search.selectedTreePid = tree.item.pid;
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
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumns() {
    this.properties.getSearchColumnsTree();
    const prop = this.properties.getStringProperty('searchColumns');
    if (prop) {
      Object.assign(this.selectedColumns, JSON.parse(prop));
    }
    this.setColumns();
    this.setColumnsWith();
  }

  setSelectedColumns() {
    this.properties.setStringProperty('searchColumns', JSON.stringify(this.selectedColumns));
    this.initSelectedColumns();
    this.table.renderRows();
  }



  setColumnsWith() {
    this.colsWidth = {};
    this.selectedColumns.forEach(c => {
      this.colsWidth[c.field] = c.width + 'px';
    })

  }

  getColumnWidth(field: string) {

    const el = this.selectedColumns.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizes(e: any, field?: string) {
    const el = this.selectedColumns.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.properties.setStringProperty('searchColumns', JSON.stringify(this.selectedColumns));
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
      data: {pid: item.pid, model: item.model},
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
}
