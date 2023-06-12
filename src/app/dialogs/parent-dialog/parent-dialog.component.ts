
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfigService } from 'src/app/services/config.service';
import { User } from 'src/app/model/user.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { SearchService } from 'src/app/services/search.service';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from '../simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';
import { UIService } from 'src/app/services/ui.service';
import { Sort } from '@angular/material/sort';
import { IngestDialogComponent } from '../ingest-dialog/ingest-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parent-dialog',
  templateUrl: './parent-dialog.component.html',
  styleUrls: ['./parent-dialog.component.scss']
})
export class ParentDialogComponent implements OnInit {

  @ViewChild('scroll') scroll: ElementRef;

  @ViewChild('split') split: SplitComponent;
  @ViewChild('area1') area1: SplitAreaDirective;
  @ViewChild('area2') area2: SplitAreaDirective;
  splitArea1Width: number;
  splitArea2Width: number;

  state = 'none';
  items: DocumentItem[];
  selectedDestItem: DocumentItem;
  selectedInSearch: DocumentItem;
  selectedTree: Tree;
  models: string[];
  model: string;
  query = '';
  queryField: string;
  searchMode: string = 'phrase';

  sortField: string = '';
  sortAsc: boolean;

  queryLabel: string;
  queryIdentifier: string;
  queryCreator: string

  organization: string;
  owner: string;
  processor: string;
  organizations: string[];
  users: User[];


  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  hierarchy: DocumentItem[];

  tree: Tree;
  expandedPath: string[] = [];


  lastClickIdx: { [key: string]: number } = { orig: -1, dest: -1 };
  lastClickIdxDest: number = -1;
  lastSelectedItemPid: string;
  lastSelectedItem: DocumentItem;
  orig: any[] = [];
  origTable: any;

  hasChanges = false;

  
  public selectedColumns = [
    { field: 'label', selected: true },
    { field: 'model', selected: false },
    { field: 'pid', selected: false },
    { field: 'processor', selected: false },
    { field: 'organization', selected: false },
    { field: 'status', selected: false },
    { field: 'created', selected: false },
    { field: 'modified', selected: true },
    { field: 'owner', selected: false },
    { field: 'export', selected: false },
    { field: 'isLocked', selected: false }
  ];


  public selectedColumnsLeftTable = [
    { field: 'pid', selected: true, width: 100 },
    { field: 'label', selected: true, width: 100 },
    { field: 'filename', selected: true, width: 100 },
    { field: 'pageType', selected: true, width: 100 },
    { field: 'pageIndex', selected: true, width: 100 },
    { field: 'pageNumber', selected: true, width: 100 },
    { field: 'pagePosition', selected: true, width: 100 },
    { field: 'model', selected: true, width: 100 },
    { field: 'owner', selected: true, width: 100 },
    { field: 'created', selected: true, width: 100 },
    { field: 'modified', selected: true, width: 100 },
    { field: 'status', selected: true, width: 100 }
  ];

  public selectedColumnsRightTable = [
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
  @ViewChild('searchTable') searchTable: MatTable<DocumentItem>;

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    public properties: LocalStorageService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    public search: SearchService,
    private ui: UIService,
    private config: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService) { }

  ngOnInit() {

    // this.models = ModelTemplate.allowedParentsForModel(this.data.items[0].model);
    this.models = this.config.allModels;
    this.initSelectedColumns();
    this.initSelectedColumnsLeftTable();
    this.initSelectedColumnsRightTable();

    // this.splitArea1Width = parseInt(this.properties.getStringProperty('parent.split.0', "60"));
    // this.splitArea2Width = 100 - this.splitArea1Width;


    if (this.data.isRepo) {
      this.model = this.properties.getStringProperty('parent.model', this.config.defaultModel);
      this.sortField = this.properties.getStringProperty('parent.sort_field', 'created');
      this.sortAsc = this.properties.getBoolProperty('parent.sort_asc', false);
    } else {
      this.model = this.config.defaultModel;
      this.sortField = 'modified';
      this.sortAsc = false;
    }
    this.queryField = this.properties.getStringProperty('parent.query_field', 'queryLabel');
    this.organizations = this.config.organizations;
    this.organization = this.properties.getStringProperty('seaparentrch.organization', '-');
    this.owner = this.properties.getStringProperty('parent.owner', '-');
    this.processor = this.properties.getStringProperty('parent.processor', '-');
    if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      this.reload();
    } else {
      this.state = 'success';
    }
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });

    this.data.items.forEach((item: DocumentItem) => {
      const di = JSON.parse(JSON.stringify(item));
      this.orig.push(di);
      this.origTable = new MatTableDataSource(this.orig);
    });

    this.reload();
  }

  isAllowed() {
    if (!this.selectedDestItem) {
      return false;
    }
    if (this.data.isRepo) {
      // No selected. Should take data.item element as origin. 
      // Selected. Check allowed in selection
      return (this.getNumOfSelected() > 0 && ModelTemplate.allowedChildrenForModel(this.selectedDestItem.model).includes(this.getSelected()[0].model))
             || (this.getNumOfSelected() === 0 && ModelTemplate.allowedChildrenForModel(this.selectedDestItem.model).includes(this.data.item.model));
    } else {
      return this.selectedDestItem && ModelTemplate.allowedChildrenForModel(this.selectedDestItem.model).includes(this.orig[0].model);
    }
    
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

  sortBy(field: string) {
    // if (this.query) {
    //   return;
    // }
    if (this.hierarchy.length > 0) {
      return;
    }
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortAsc = false;
    }
    this.sortField = field;
    this.properties.setStringProperty('search.sort_field', this.sortField);
    this.properties.setBoolProperty('search.sort_asc', this.sortAsc);
    this.reload();
  }

  reload(page: number = 0) {

    if (this.data.isRepo) {
      this.properties.setStringProperty('parent.model', this.model);
      this.properties.setStringProperty('parent.query_field', this.queryField);
      this.properties.setStringProperty('parent.organization', this.organization);
      this.properties.setStringProperty('parent.owner', this.owner);
      this.properties.setStringProperty('parent.processor', this.processor);
    }


    this.hierarchy = [];
    this.selectedDestItem = null;
    this.pageIndex = page;
    this.state = 'loading';
    const options = {
      type: this.searchMode,
      model: this.model,
      query: this.query,
      queryField: this.queryField,
      page: this.pageIndex,
      sortField: this.sortField,
      sortAsc: this.sortAsc,

      organization: this.organization,
      queryLabel: this.queryLabel,
      queryIdentifier: this.queryIdentifier,
      queryCreator: this.queryCreator,
      owner: this.owner,
      processor: this.processor,

    }
    this.api.getSearchResults(options).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      this.state = 'success';
      if (this.data.isRepo) {
        this.findAndSelect();
      }
      
    });
  }

  findAndSelect() {
    if (this.properties.getStringProperty('parent.expandedPath')) {
      this.expandedPath = JSON.parse(this.properties.getStringProperty('parent.expandedPath'));
    }
    if (this.expandedPath) {
      const root = this.expandedPath[this.expandedPath.length - 1];
      if (root) {
        const item = this.items.find(i => i.pid === root);
        if (item) {

          this.selectItem(item);
          setTimeout(() => {
            document.getElementById(root).scrollIntoView({ block: 'center' });
            // this.search.selectedTreePid = this.expandedPath[0];
          }, 550);

        }

      }
    }
  }

  setExpandedPath(tree: Tree) {
    this.expandedPath.push(tree.item.pid);
    if (tree.parent) {
      this.setExpandedPath(tree.parent);
    }
  }

  onPageChanged(page: any) {
    this.reload(page.pageIndex);
  }

  onSave() {
    if (!this.selectedDestItem) {
      return;
    }
    if (this.selectedTree) {
      this.expandedPath = [];
      this.setExpandedPath(this.selectedTree);
    } else {
      this.expandedPath = [this.selectedDestItem.pid]
    }
    this.properties.setStringProperty('parent.expandedPath', JSON.stringify(this.expandedPath));
    this.relocateOutside(this.orig.filter(i => i.selected), this.selectedDestItem.pid);
  }

  onDeleteParent() {
    this.deleteParent()
  }

  

  private deleteParent() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.delete_parent_dialog.title')),
      message: String(this.translator.instant('editor.children.delete_parent_dialog.message')),
      alertClass: 'app-message',
      btn1: {
        label: String(this.translator.instant('common.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('common.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        
          this.state = 'saving';
          const pid = this.getNumOfSelected() > 0 ? this.lastSelectedItemPid: this.data.item.pid;
          const parent = this.getNumOfSelected() > 0 ? this.lastSelectedItem.parent : this.data.parent;
          this.api.deleteParent(pid, parent).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorDialogFromObject(response['response'].errors);
              this.state = 'error';
              return;
            } else {
              this.state = 'success';
              this.ui.showInfoSnackBar('Vazba zrusena');
              this.hasChanges = true;
            }
          });
        
      }
    });
  }

  private relocateOutside(items: DocumentItem[], destinationPid: string) {
    const title = this.data.isRepo ?
                  String(this.translator.instant('editor.children.relocate_dialog.titleRepo')) :
                  String(this.translator.instant('editor.children.relocate_dialog.titleImport'));
    const message = this.data.isRepo ?
                  String(this.translator.instant('editor.children.relocate_dialog.messageRepo')) :
                  String(this.translator.instant('editor.children.relocate_dialog.messageImport'));
    const data: SimpleDialogData = {
      title,
      message,
      alertClass: 'app-message',
      btn1: {
        label: String(this.translator.instant('common.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('common.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (!this.data.isRepo) {
          this.ingestBatch(destinationPid);
        } else if (this.getNumOfSelected() > 0) {
          // Mame vybrane objekty
          this.relocateObjects(items[0].parent, destinationPid, this.orig.filter(c => c.selected).map(c => c.pid));
        } else if (this.data.parent) {
          // Nemame, presouvame data.item
          this.relocateObjects(this.data.parent, destinationPid, this.data.item.pid);
        } else {
          // Nemame vybrane ani parent
          this.setParent(this.data.item.pid, destinationPid);
        }

      }
    });
  }

  private ingestBatch(parentPid: string) {
    this.state = 'saving';
    const bathId = parseInt(this.data.batchId);
    const dialogRef = this.dialog.open(IngestDialogComponent, { data: { batch: bathId, parent: parentPid } });
    dialogRef.afterClosed().subscribe(result => {
      this.state = 'success';
      if (result == 'open') {
        this.router.navigate(['/repository', parentPid]);
      } else {
        this.router.navigate(['/']);
      }
    });
    this.dialogRef.close(false);
  }

  relocateObjects(parentPid: string, destinationPid: string, pids: string[]) {
    this.state = 'saving';
    const pid = this.selectedDestItem.pid;
    this.clearSelected();
    

    this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }

      this.ui.showInfoSnackBar('Objekt presunut');
      let nextSelection = 0;
      for (let i = this.orig.length - 1; i >= 0; i--) {
        if (pids.indexOf(this.orig[i].pid) > -1) {
          this.orig.splice(i, 1);
          nextSelection = i - 1;
        }
      }
      if (nextSelection < 0) {
        nextSelection = 0;
      }

      this.origTable = new MatTableDataSource(this.orig);
      this.state = 'success';
      const item = this.items.find(item => pid);
      this.selectItem(item);
      this.findAndSelect();
      // this.tree = new Tree(this.selectedItem);
      this.hasChanges = true;
    });
  }

  setParent(pid: string, destinationPid: string) {
    this.state = 'saving';
    // let pids: string[] = this.orig.filter(c => c.selected).map(c => c.pid);
    this.api.setParent(pid, destinationPid).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar('Objekt presunut');
        this.hasChanges = true;
      }
    });
  }

  clearSelected() {
    this.selectedDestItem = null;
    this.selectedInSearch = null;
    this.search.selectedTreePid = null;
    this.tree = null;
  }

  selectItem(item: DocumentItem) {
    //this.selectedItem = null;
    //setTimeout(() => {

    this.selectedDestItem = item;
    this.selectedInSearch = item;
    this.search.selectedTreePid = item.pid;
    this.tree = new Tree(item);
    //}, 10);

  }

  open(item: DocumentItem, index: number = -1) {
  }


  sortTable(sortState: Sort) {
    this.sortBy(sortState.active);
  }

  private loadChildrenForPid(pid: string) {
    this.state = 'loading';
    this.api.getRelations(pid).subscribe((children: DocumentItem[]) => {
      this.items = [];
      for (const child of children) {
        if (!child.isPage()) {
          this.items.push(child);
        }
      }
      this.state = 'success';
    });
  }

  openFromTree(item: DocumentItem) {
    this.selectedDestItem = item;
  }

  selectFromTree(tree: Tree) {
    this.search.selectedTreePid = tree.item.pid;
    this.selectedTree = tree;
    this.selectedDestItem = tree.item;
  }

  dragEnd(e: any) {
    // this.splitArea1Width = e.sizes[0];
    // this.splitArea2Width = e.sizes[1];
    this.properties.setStringProperty('parent.split.0', e.sizes[0]);
    this.properties.setStringProperty('parent.split.1', e.sizes[1]);
  }

  select(array: any[], item: DocumentItem, idx: number, event: MouseEvent, col: string) {
    if (event && (event.metaKey || event.ctrlKey)) {
      // Nesmi byt prazdna selecke pro import
      console.log('tady')
      item.selected = !item.selected;
    } else if (event && event.shiftKey) {
      if (this.lastClickIdx[col] > -1) {
        const from = Math.min(this.lastClickIdx[col], idx);
        const to = Math.max(this.lastClickIdx[col], idx);
        for (let i = from; i <= to; i++) {
          array[i].selected = true;
        }
      } else {
        // nic neni.
        array.forEach(i => i.selected = false);
        item.selected = true;
      }

    } else {
      array.forEach(i => i.selected = false);
      item.selected = true;
    }
    this.lastClickIdx[col] = idx;
    this.lastSelectedItemPid = item.pid;
    this.lastSelectedItem = item;
  }

  public getNumOfSelected() {
    return this.orig.filter(i => i.selected).length;
  }

  getSelected() {
    return this.orig.filter(i => i.selected);
  }

  setColumns() {
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumns() {
    const prop = this.properties.getStringProperty('searchColumnsParent');
    if (prop) {
      Object.assign(this.selectedColumns, JSON.parse(prop));
    }
    this.setColumns();
  }

  setSelectedColumns() {
    this.properties.setStringProperty('searchColumnsParent', JSON.stringify(this.selectedColumns));
    this.initSelectedColumns();
    this.searchTable.renderRows();
  }

  // resizable columns
  setColumnsLeftTable() {
    this.origTable = this.selectedColumnsLeftTable.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumnsLeftTable() {
    const prop = this.properties.getStringProperty('parentDialogLeftTableColumns');
    if (prop) {
      Object.assign(this.selectedColumnsLeftTable, JSON.parse(prop));
    }
    this.setColumnsLeftTable();
  }

  getColumnWidthLeftTable(field: string) {
    const el = this.selectedColumnsLeftTable.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesLeftTable(e: any, field?: string) {
    const el = this.selectedColumnsLeftTable.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.properties.setStringProperty('parentDialogLeftTableColumns', JSON.stringify(this.selectedColumnsLeftTable));
  }

  setColumnsRightTable() {
    this.displayedColumns = this.selectedColumnsRightTable.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumnsRightTable() {
    const prop = this.properties.getStringProperty('parentDialogRightTableColumns');
    if (prop) {
      Object.assign(this.selectedColumnsRightTable, JSON.parse(prop));
    }
    this.setColumnsRightTable();
  }

  getColumnWidthRightTable(field: string) {
    const el = this.selectedColumnsRightTable.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesRightTable(e: any, field?: string) {
    const el = this.selectedColumnsRightTable.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.properties.setStringProperty('parentDialogRightTableColumns', JSON.stringify(this.selectedColumnsRightTable));
  }
  // end

}

