
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SplitComponent, AngularSplitModule } from 'angular-split';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from '../simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentItem } from '../../model/documentItem.model';
import { ModelTemplate } from '../../model/modelTemplate';
import { Tree } from '../../model/mods/tree.model';
import { User } from '../../model/user.model';
import { ResizecolDirective } from '../../resizecol.directive';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Configuration } from '../../shared/configuration';
import { Utils } from '../../utils/utils';
import { IngestDialogComponent } from '../ingest-dialog/ingest-dialog.component';
import { ViewerComponent } from "../../components/viewer/viewer.component";
import { UserTableComponent } from "../../components/user-table/user-table.component";

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule,
    MatTableModule, MatSortModule, MatDialogModule, ViewerComponent, UserTableComponent],
  selector: 'app-parent-dialog',
  templateUrl: './parent-dialog.component.html',
  styleUrls: ['./parent-dialog.component.scss']
})
export class ParentDialogComponent implements OnInit {

  @ViewChild('scroll') scroll: ElementRef;
  @ViewChild('modelSelect') modelSelect: MatSelect;
  splitArea1Width: number;
  splitArea2Width: number;

  state = 'none';
  items: DocumentItem[];
  selectedDestItem: DocumentItem;
  selectedInSearch: DocumentItem;
  selectedTree: Tree;
  models: string[];
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

  searchedModel: string;
  searchedQuery: string;
  searchedQueryLabel: string;
  searchedIdentifier: string;
  searchedOwner: string;
  searchedProcessor: string;

  hasChanges = false;


  colsWidth: { [key: string]: string } = {};
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

  displayedColumnsRight: string[] = [];
  displayedColumnsLeft: string[] = [];
  @ViewChild('searchTable') searchTable: MatTable<DocumentItem>;

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private ui: UIService,
    public config: Configuration,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService) { }

  ngOnInit() {

    this.models = this.config.models;
    this.initSelectedColumnsRightTable();

    // this.splitArea1Width = parseInt(this.properties.getStringProperty('parent.split.0', "60"));
    // this.splitArea2Width = 100 - this.splitArea1Width;


    if (this.data.isRepo) {
      this.sortField = this.settings.parentSortField;
      this.sortAsc = this.settings.parentSortAsc;
    } else {
      this.sortField = 'modified';
      this.sortAsc = false;
    }
    this.queryField = this.settings.parentQueryField;
    this.organizations = this.config.organizations;
    this.organization = this.settings.parentOrganization;
    this.owner = this.settings.parentOwner;
    this.processor = this.settings.parentProcessor;
    if (this.settings.parentModel !== 'all' && this.settings.parentModel !== 'model:page' && this.settings.parentModel !== 'model:ndkpage') {
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
      return (this.getNumOfSelected() > 0 && ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedDestItem.model).includes(this.getSelected()[0].model))
        || (this.getNumOfSelected() === 0 && ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedDestItem.model).includes(this.data.item.model));
    } else {

      return this.selectedDestItem &&
        (
          // Pri importu pokud je na importu strana nebo ndk audio strana tak maji zvukove modely vyjimku a da se napojit na jakykoli model ze zvukovych.
          ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedDestItem.model).includes(this.orig[0].model) ||
          (this.selectedDestItem.isMusicDocument() &&
            ('model:ndkaudiopage' === this.orig[0].model || 'model:page' === this.orig[0].model)
          )
        );
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
    this.reload();
  }

  reload(page: number = 0) {

    this.settings.parentSortField = this.sortField;
    this.settings.parentSortAsc = this.sortAsc;
    if (this.data.isRepo) {
      this.settings.parentQueryField = this.queryField;
      this.settings.parentOwner = this.owner;
      this.settings.parentProcessor = this.processor;
      this.settings.parentOrganization = this.organization;
    }
    this.settingsService.save();

    this.hierarchy = [];
    this.selectedDestItem = null;
    this.pageIndex = page;
    this.state = 'loading';
    const options = {
      type: this.searchMode,
      model: this.settings.parentModel,
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
    this.searchedModel = options.model;
    this.searchedQuery = options.query;
    this.searchedQueryLabel = options.queryLabel;
    this.searchedIdentifier = options.queryIdentifier;
    this.searchedOwner = options.owner;
    this.searchedProcessor = options.processor;
  }

  findAndSelect() {
    this.expandedPath = Utils.clone(this.settings.parentExpandedPath);
    
    if (this.expandedPath) {
      const root = this.expandedPath[this.expandedPath.length - 1];
      if (root) {
        const item = this.items.find(i => i.pid === root);
        if (item) {
          this.selectItem(item);
          setTimeout(() => {
            document.getElementById(root).scrollIntoView({ block: 'center' });
            const lastParent = this.expandedPath[0];
            if (lastParent) {
              setTimeout(() => {
                document.getElementById('tree_' + lastParent).scrollIntoView({ block: 'center' });
              }, 550);
            }

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
    this.settings.parentExpandedPath = Utils.clone(this.expandedPath);
    this.settingsService.save();
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
        const pid = this.getNumOfSelected() > 0 ? this.lastSelectedItemPid : this.data.item.pid;
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
    this.tree = null;
  }

  selectDest(e: {item: DocumentItem, event?: MouseEvent, idx?: number}) {
    this.selectItem(e.item);
  }

  selectItem(item: DocumentItem) {
    //this.selectedItem = null;
    //setTimeout(() => {

    this.selectedDestItem = item;
    this.selectedInSearch = item;
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
    this.selectedTree = tree;
    this.selectedDestItem = tree.item;
  }

  splitDragEnd(e: any) {
    this.settings.parentSplit = e.sizes[0];
    this.settingsService.save();
  }

  selectOrig(e: {item: DocumentItem, event?: MouseEvent, idx?: number}) {
    this.select(this.orig, e.item, e.idx, e.event, 'dest');
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


  getColumnWidthLeftTable(field: string) {
    const el = this.settings.columnsParentLeft.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesLeftTable(e: any, field?: string) {
    const el = this.settings.columnsParentLeft.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.settingsService.save();
  }

  initSelectedColumnsRightTable() {
    this.displayedColumnsRight = this.settings.columnsParentRight.filter(c => c.selected).map(c => c.field);
    this.displayedColumnsRight.forEach(c => {
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnType(c);
      this.prefixes[c] = this.prefixByType(c);

    });
    this.data.displayedColumns.forEach((c: string) => {
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnType(c);
      this.prefixes[c] = this.prefixByType(c);

    });
  }

  getColumnWidthRightTable(field: string) {
    const el = this.settings.columnsParentRight.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesRightTable(e: any, field?: string) {
    const el = this.settings.columnsParentRight.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }
    this.settingsService.save();
  }
  // end

  enterModel(e: any) {
    this.modelSelect.close();
    this.reload();
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

}

