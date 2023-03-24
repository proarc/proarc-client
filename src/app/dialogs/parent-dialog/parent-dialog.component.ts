
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
  splitArea1Width: string;
  splitArea2Width: string;

  state = 'none';
  items: DocumentItem[];
  selectedItem: DocumentItem;
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

  displayedColumns: string[] = [];
  @ViewChild('searchTable') searchTable: MatTable<DocumentItem>;

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    public properties: LocalStorageService,
    private translator: TranslateService,
    private dialog: MatDialog,
    public search: SearchService,
    private ui: UIService,
    private config: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService) { }

  ngOnInit() {

    // this.models = ModelTemplate.allowedParentsForModel(this.data.items[0].model);
    this.models = this.config.allModels;
    this.initSelectedColumns();

    this.splitArea1Width = this.properties.getStringProperty('parent.split.0', "60"),
      this.splitArea2Width = this.properties.getStringProperty('parent.split.1', "40"),
      this.model = this.properties.getStringProperty('parent.model', this.config.defaultModel);
    this.queryField = this.properties.getStringProperty('parent.query_field', 'queryLabel');

    this.organizations = this.config.organizations;
    this.organization = this.properties.getStringProperty('seaparentrch.organization', '-');
    this.owner = this.properties.getStringProperty('parent.owner', '-');
    this.processor = this.properties.getStringProperty('parent.processor', '-');
    this.sortField = this.properties.getStringProperty('parent.sort_field', 'created');
    this.sortAsc = this.properties.getBoolProperty('parent.sort_asc', false);
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
    return this.getNumOfSelected() > 0 && this.selectedItem && ModelTemplate.allowedChildrenForModel(this.selectedItem.model).includes(this.getSelected()[0].model);
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

    this.properties.setStringProperty('parent.model', this.model);
    this.properties.setStringProperty('parent.query_field', this.queryField);
    this.properties.setStringProperty('parent.organization', this.organization);
    this.properties.setStringProperty('parent.owner', this.owner);
    this.properties.setStringProperty('parent.processor', this.processor);


    this.hierarchy = [];
    this.selectedItem = null;
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
      if (this.data.expandedPath) {
        this.expandedPath = this.data.expandedPath;
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
    });
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
    if (!this.selectedItem) {
      return;
    }
    if (this.selectedTree) {
      this.expandedPath = [];
      this.setExpandedPath(this.selectedTree);
    } else {
      this.expandedPath = [this.selectedItem.pid]
    }
    this.properties.setStringProperty('parent.expandedPath', JSON.stringify(this.expandedPath));
    this.relocateOutside(this.orig.filter(i => i.selected), this.selectedItem.pid);

    // this.dialogRef.close({ pid: this.selectedItem.pid, selectedItem: this.selectedItem, selectedTree: this.selectedTree, expandedPath: this.expandedPath });
  }

  onDeleteParent() {
    this.deleteParent(this.data.parent.pid)
    // this.dialogRef.close({ delete: true });
  }

  

  private deleteParent(parent: string) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.delete_parent_dialog.title')),
      message: String(this.translator.instant('editor.children.delete_parent_dialog.message')),
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
        if (parent) {
          this.state = 'saving';
          this.api.deleteParent(this.lastSelectedItemPid, parent).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorSnackBarFromObject(response['response'].errors);
              this.state = 'error';
              return;
            } else {
              this.state = 'success';

              this.hasChanges = true;
            }
          });
        }
      }
    });
  }

  private relocateOutside(items: DocumentItem[], destinationPid: string) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.relocate_dialog.title')),
      message: String(this.translator.instant('editor.children.relocate_dialog.message')),
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
        if (this.getNumOfSelected() > 0 || this.data.parent) {
          this.relocateObjects(items[0].parent, destinationPid);
        } else {
          this.setParent(destinationPid);
        }

      }
    });
  }

  relocateObjects(parentPid: string, destinationPid: string) {
    this.state = 'saving';
    let pids: string[] = this.orig.filter(c => c.selected).map(c => c.pid);
    const isMultiple = this.orig.filter(c => c.selected).length > 1;

    this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }

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
      this.hasChanges = true;
    });
  }

  setParent(destinationPid: string) {
    this.state = 'saving';
    let pids: string[] = this.orig.filter(c => c.selected).map(c => c.pid);
    this.api.setParent(this.lastSelectedItemPid, destinationPid).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.state = 'success';
      }
    });
  }



  selectItem(item: DocumentItem) {
    //this.selectedItem = null;
    //setTimeout(() => {

    this.selectedItem = item;
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
    this.selectedItem = item;
  }

  selectFromTree(tree: Tree) {
    this.search.selectedTreePid = tree.item.pid;
    this.selectedTree = tree;
    this.selectedItem = tree.item;
  }

  dragEnd(e: any) {
    this.splitArea1Width = e.sizes[0];
    this.splitArea2Width = e.sizes[1];
    this.properties.setStringProperty('parent.split.0', e.sizes[0]);
    this.properties.setStringProperty('parent.split.1', e.sizes[1]);
  }

  getSplitSize(split: number): number {
    if (split == 0) {
      return parseInt(this.splitArea1Width);
    }
    return parseInt(this.splitArea2Width);
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

}

