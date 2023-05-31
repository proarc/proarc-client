

import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, ViewChildren, ViewContainerRef, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResizedEvent } from 'angular-resize-event';
import { ChildrenValidationDialogComponent } from 'src/app/dialogs/children-validation-dialog/children-validation-dialog.component';
import { ConvertDialogComponent } from 'src/app/dialogs/convert-dialog/convert-dialog.component';
import { MarkSequenceDialogComponent } from 'src/app/dialogs/mark-sequence-dialog/mark-sequence-dialog.component';
import { NewMetadataDialogComponent } from 'src/app/dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { NewObjectData, NewObjectDialogComponent } from 'src/app/dialogs/new-object-dialog/new-object-dialog.component';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ILayoutPanel, localStorageName } from 'src/app/dialogs/layout-admin/layout-admin.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UIService } from 'src/app/services/ui.service';

import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ColumnsSettingsDialogComponent } from 'src/app/dialogs/columns-settings-dialog/columns-settings-dialog.component';


@Component({
  selector: 'app-editor-structure',
  templateUrl: './editor-structure.component.html',
  styleUrls: ['./editor-structure.component.scss']
})
export class EditorStructureComponent implements OnInit {

  @Input() viewMode: string; // 'list' | 'grid' | 'icons'
  @Input('panel') panel: ILayoutPanel;
  @Output() onIngest = new EventEmitter<boolean>();

  @ViewChild('table') table: MatTable<DocumentItem>;
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;
  @ViewChildren('matrow', { read: ViewContainerRef }) rows: QueryList<ViewContainerRef>;
  @ViewChild('childrenList') childrenListEl: ElementRef;
  @ViewChild('childrenIconList') childrenIconListEl: ElementRef;
  @ViewChild('childrenGridList') childrenGridListEl: ElementRef;
  @ViewChild('childrenWrapper') childrenWrapperEl: ElementRef;

  public state = 'none';
  isRepo: boolean = true;

  lastClickIdx: number = -1;
  // rows: DocumentItem[] = [];

  source: any;
  sourceNext: any;
  dragEnabled = true;
  sourceIndex: number;
  targetIndex: number;
  isDragging = false;


  expandedPath: string[];

  movedToIndex: boolean;
  arrowIndex: number;

  iconColumns: number;
  iconWidth: number;
  iconHeight: number;

  shortLabels = false;
  pageChildren = false;
  public relocationMode: boolean;

  hasChanges: boolean = false;
  scrollPos = -1;
  dragDisabled = true;

  // public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  public selectedColumns = [
    { field: 'label', selected: true, width: 140 },
    { field: 'filename', selected: true, width: 140 },
    { field: 'pageType', selected: true, width: 140 },
    { field: 'pageNumber', selected: true, width: 140 },
    { field: 'pageIndex', selected: true, width: 140 },
    { field: 'pagePosition', selected: true, width: 140 },
    { field: 'model', selected: true, width: 140 },
    { field: 'pid', selected: false, width: 140 },
    { field: 'owner', selected: false, width: 140 },
    { field: 'created', selected: false, width: 140 },
    { field: 'modified', selected: true, width: 140 },
    { field: 'status', selected: false, width: 140 }
  ];
  displayedColumns: string[] = [];

  subscriptions: Subscription[] = [];

  refreshing = false;

  constructor(
    private router: Router,
    private properties: LocalStorageService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private ui: UIService,
    private api: ApiService,
    public auth: AuthService,
    public layout: LayoutService
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.isRepo = this.layout.type === 'repo';
    
    // this.setSelectedColumns();
    
    this.shortLabels = this.properties.getBoolProperty('children.short_labels', false);
    this.pageChildren = this.layout.items.findIndex(it => it.isPage()) > -1;
    if (!this.isRepo) {
      this.lastClickIdx = 0;
    }
    this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((fromStructure: boolean) => {
      // this.setScrollPos();
      this.refreshing = true;
      setTimeout(() => {
        this.scrollBack();
      }, 500);
    }));

    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      this.setSelectedColumns();
    }));

  }

  ngAfterViewInit() {
    this.childrenWrapperEl.nativeElement.focus();
    this.setColumnSizes();

    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      this.pageChildren = this.layout.items.findIndex(it => it.isPage()) > -1;
      if (!fromStructure) {
        this.arrowIndex = this.layout.getFirstSelectedIndex();
        this.obtainFocus();
      }
      if (this.table) {
        this.table.renderRows();
      }

    }));

    this.layout.moveToNext().subscribe((idx: number) => {
      this.moveToNext(idx);
    });
  }

  tableRendered() {
    if (this.scrollPos > -1) {
      document.getElementById('table').parentElement.parentElement.scrollTop = this.scrollPos;
    }
  }

  setScrollPos() {
    if (!this.refreshing) {
      this.scrollPos = this.childrenListEl.nativeElement.scrollTop;
    }
  }

  scrollBack() {
    if (this.scrollPos > -1) {
      this.childrenListEl.nativeElement.scrollTop = this.scrollPos;
    }
    this.refreshing = false;
  }

  scrollToSelected() {
    const index = this.layout.items.findIndex(i => i.selected);
    if (index < 0) {
      return;
    }
    let container: any;
    if (this.viewMode == 'grid') {
      container = this.childrenGridListEl;
    } else if (this.viewMode == 'icons') {
      container = this.childrenIconListEl;
    } else {
      if (this.scrollPos > -1) {
        console.log(document.getElementById('table').parentElement.parentElement)
        document.getElementById('table').parentElement.parentElement.scrollTop = this.scrollPos;
      } else {
        let row = this.rows.get(index);
        row.element.nativeElement.scrollIntoView(true);
      }
      return;
    }


    if (container) {
      if (this.scrollPos > -1) {
        container.nativeElement.scrollTop = this.scrollPos;
        return;
      }
      if (index > 0) {
        const el = container.nativeElement.children[index];
        el.scrollIntoView(true);
      }
    }
  }

  obtainFocus() {
    this.childrenWrapperEl.nativeElement.focus();
  }

  onResized(event: ResizedEvent) {
    const d = event.newRect.width / 101;
    this.iconColumns = Math.floor(d);

    this.iconHeight = ((event.newRect.width - 4.0) / this.iconColumns) * 1.47;
    this.iconWidth = 100.0 / this.iconColumns;
  }

  // navigate by keyboard
  keyup(event: any) {
    if (!event) {
      return;
    }
    if (event.keyCode === 37 || event.keyCode === 38) {
      event.stopPropagation();
      event.preventDefault();
      let step = 1;
      if (event.keyCode === 38 && (this.viewMode === 'icons' || this.viewMode === 'grid')) {
        step = this.iconColumns;
      }
      if (this.arrowIndex - step >= 0) {
        this.rowClick(this.layout.items[this.arrowIndex - step], this.arrowIndex - step, event);
      }
    } else if (event.keyCode === 39 || event.keyCode === 40) {
      event.stopPropagation();
      event.preventDefault();
      let step = 1;
      if (event.keyCode === 40 && (this.viewMode === 'icons' || this.viewMode === 'grid')) {
        step = this.iconColumns;
      }
      if (this.arrowIndex + step < this.layout.items.length) {
        this.rowClick(this.layout.items[this.arrowIndex + step], this.arrowIndex + step, event);
      }
    }

  }

  moveToNext(index: number) {
    if (index < this.layout.items.length) {
      this.rowClick(this.layout.items[index], index, null);
    }
  }

  switchUseShortLabel() {
    this.shortLabels = !this.shortLabels;
    this.properties.setBoolProperty('children.short_labels', this.shortLabels);
  }

  changeViewMode(view: string) {
    this.viewMode = view;
    this.panel.type = 'structure-' + view;
    const l = this.isRepo ? 'repo' : 'import';
    localStorage.setItem(localStorageName + '-' + l, JSON.stringify(this.layout.layoutConfig))
  }

  selectedColumnsPropName(model: string) {
    return this.isRepo ? 'selectedColumnsRepo_' + model : 'selectedColumnsImport';
  }

  setSelectedColumns() {
    if (this.isRepo) {
      this.setSelectedColumnsRepo();
    } else {
      this.setSelectedColumnsImport();
    }
  }

  setSelectedColumnsRepo() {
    const models: string[] = [];
    this.layout.items.forEach(i => {
      if (!models.includes(i.model)) {
        models.push(i.model);
      }
    });
    const colsEditModeParent = this.properties.getColsEditingRepo();
    this.displayedColumns = [];
    if (colsEditModeParent) {
      this.displayedColumns = this.properties.colsEditingRepo[this.layout.selectedParentItem.model].filter(c => c.selected && !this.displayedColumns.includes(c.field)).map(c => c.field);
    } else {
      models.forEach(model => {
        const f = this.properties.colsEditingRepo[model].filter(c => c.selected && !this.displayedColumns.includes(c.field)).map(c => c.field);
        this.displayedColumns.push(...f);
      });
    }
  }

  setSelectedColumnsImport() {
    const cols = this.properties.getSelectedColumnsEditingImport();
    this.displayedColumns = cols.filter((c: any) => c.selected).map((c: any) => c.field);
  }

  selectAll() {
    this.layout.items.forEach(i => i.selected = true);
    this.layout.setSelection(true);
  }

  selectColumns() {
    const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
      data: {
        itemModel: this.layout.item.model,
        selectedModel: this.layout.lastSelectedItem.model
      },
      width: '50%',
      maxWidth: '100vw',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.layout.setShouldRefresh(false);
      }
    });
  }

  rowClick(row: DocumentItem, idx: number, event: MouseEvent) {
    if (event && (event.metaKey || event.ctrlKey)) {
      // Nesmi byt prazdna selecke pro import
      if (this.layout.type === 'import' && row.selected && this.layout.getNumOfSelected() === 1) {
        this.layout.lastSelectedItem = row;
        return;
      } else {
        row.selected = !row.selected;
      }
    } else if (event && event.shiftKey) {
      if (this.lastClickIdx > -1) {
        const from = Math.min(this.lastClickIdx, idx);
        const to = Math.max(this.lastClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.layout.items[i].selected = true;
        }
      } else {
        // nic neni.
        this.layout.items.forEach(i => i.selected = false);
        row.selected = true;
      }

    } else {
      this.layout.items.forEach(i => i.selected = false);
      row.selected = true;
    }
    this.lastClickIdx = idx;
    // this.layout.lastSelectedItem = row;
    if (row.selected) {
      this.layout.lastSelectedItem = row;
    } else {
      const last = this.layout.items.filter((i: DocumentItem) => i.selected);
      if (last.length > 0) {
        this.layout.lastSelectedItem = last[last.length - 1];
      }
    }
    this.layout.setSelection(true);
    this.arrowIndex = idx;
  }

  open(item: DocumentItem) {
    if (this.isRepo) {
      this.goToObject(item);
    }
  }

  public goToObject(item: DocumentItem) {
    if (item) {
      this.router.navigate(['/repository', item.pid]);
    }
  }

  public goToParent() {
    this.router.navigate(['/repository', this.layout.parent.pid]);
  }

  public goToFirst() {
    this.router.navigate(['/repository', this.layout.parent.pid]);
  }

  goToNext() {
    this.router.navigate(['/repository', this.layout.nextItem.pid]);
  }

  goToPrevious() {
    this.router.navigate(['/repository', this.layout.previousItem.pid]);
  }

  // Drag events

  private getIndex(el: any) {
    return Array.prototype.indexOf.call(el.parentNode.childNodes, el);
  }

  private isbefore(a: any, b: any) {
    if (a.parentNode === b.parentNode) {
      for (let cur = a; cur; cur = cur.previousSibling) {
        if (cur === b) {
          return true;
        }
      }
    }
    return false;
  }

  mousedown(event: any) {
    this.dragEnabled = true;
  }

  mouseup(event: any) {
    this.dragEnabled = false;
  }

  dragstart(item: DocumentItem, idx: number, event: any) {
    if (!this.dragEnabled) {
      return;
    }
    const isMultiple = this.layout.getNumOfSelected() > 1;
    this.source = event.currentTarget;
    this.sourceNext = event.currentTarget.nextSibling;
    this.sourceIndex = idx;
    if (isMultiple && !item.selected) {
      this.dragEnabled = false;
      event.preventDefault();
      return;
    }
    if (!isMultiple) {
      this.rowClick(item, idx, null);
    }
    this.isDragging = true;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData("items", JSON.stringify(this.layout.getSelected()));
    event.dataTransfer.setData("panel", this.panel.id);
  }

  dragenter(event: any, idx: number) {
    const target = event.currentTarget;
    if (!this.dragEnabled || !this.source ||
      this.source.parentNode !== event.currentTarget.parentNode ||
      this.source === target) {
      // event.dataTransfer.dropEffect = 'none';
      return;
    }
    this.targetIndex = idx;

    if (this.isbefore(this.source, target)) {
      target.parentNode.insertBefore(this.source, target); // insert before
    } else {
      target.parentNode.insertBefore(this.source, target.nextSibling); // insert after
    }

  }

  dragover(event: any) {
    event.preventDefault();
    // if (this.panel.id !== event.dataTransfer.getData("panel")) {
    //   event.dataTransfer.dropEffect = 'none';
    // }
    if (!this.dragEnabled || !this.source || this.source.parentNode !== event.currentTarget.parentNode) {
      event.dataTransfer.dropEffect = 'none';
    }

    return false;
  }


  dragend(event: any) {

    this.isDragging = false;
    if (!this.dragEnabled) {
      return;
    }

    const isMultiple = this.layout.getNumOfSelected() > 1;

    const targetIndex = this.getIndex(this.source);
    let to = targetIndex;
    to = this.targetIndex;
    // this.source.parentNode.insertBefore(this.source, this.sourceNext);
    if (isMultiple) {

      this.dropMultiple();

      // const movedItems = [];
      // let shift = 0;
      // for (let i = this.layout.items.length - 1; i >= 0; i--) {
      //   if (this.layout.items[i].selected) {
      //     const item = this.layout.items.splice(i, 1);
      //     movedItems.push(item[0]);
      //     if (i < to) {
      //       shift += 1;
      //     }
      //   }
      // }
      // if (shift > 1) {
      //   to = to - shift + 1;
      // }
      // const rest = this.layout.items.splice(to, this.layout.items.length - to);
      // for (let i = movedItems.length - 1; i >= 0; i--) {
      //   this.layout.items.push(movedItems[i]);
      // }
      // for (let i = 0; i < rest.length; i++) {
      //   const item = rest[i];
      //   this.layout.items.push(item);
      // }
      // this.layout.setIsDirty(this as Component);
      // this.hasChanges = true;
      // if (this.table) {
      //   this.table.renderRows();
      // }

    } else {
      const from = this.sourceIndex;

      this.hasChanges = true;
      if (from !== to) {
        this.reorder(from, to);
      }
    }
    this.layout.setSelectionChanged(true);
  }

  public trackItem(index: number, item: DocumentItem) {
    return item.pid;
  }

  dropMultiple() {
    const selections: number[] = [];
    let indexCounted = false;

    // Get the indexes for all selected items
    this.layout.items.forEach((item, i) => {
      if (item.selected) {
        selections.unshift(i);
      }
    });

    const selected: DocumentItem[] = this.layout.items.filter(i => i.selected);
    if (selections.length > 1) {
      let newIndex = this.targetIndex;
      selections.forEach(s => {
        const item = this.layout.items.splice(s, 1);
        if (s < this.targetIndex) {
          newIndex--;
          indexCounted = true;
        }
      });
      if (indexCounted) {
        newIndex++;
      }
      this.layout.items.splice(newIndex, 0, ...selected);

    } else {
      // If a single selection
      moveItemInArray(this.layout.items, this.sourceIndex, this.targetIndex);
    }
    this.layout.setIsDirty(this as Component);
    this.hasChanges = true;
    if (this.table) {
      this.table.renderRows();

    }
    this.state = 'loading';
    setTimeout(() => {
      this.state = 'success';
    }, 1);
  }

  reorderMultiple(to: number) {
    const movedItems = [];
    let shift = 0;
    for (let i = this.layout.items.length - 1; i >= 0; i--) {
      if (this.layout.items[i].selected) {
        const item = this.layout.items.splice(i, 1);
        movedItems.push(item[0]);
        if (i < to) {
          shift += 1;
        }
      }
    }
    if (shift > 1) {
      to = to - shift + 1;
    }
    const rest = this.layout.items.splice(to, this.layout.items.length - to);
    for (let i = movedItems.length - 1; i >= 0; i--) {
      this.layout.items.push(movedItems[i]);
    }
    for (let i = 0; i < rest.length; i++) {
      const item = rest[i];
      this.layout.items.push(item);
    }
    this.layout.setIsDirty(this as Component);
    if (this.table) {
      this.table.renderRows();
    }
  }

  reorder(from: number, to: number) {
    this.hasChanges = true;
    if (this.layout.getNumOfSelected() > 1) {
      this.reorderMultiple(to + 1);
    } else {
      this.layout.setIsDirty(this as Component);
      const item = this.layout.items[from];
      this.layout.items.splice(from, 1);
      this.layout.items.splice(to, 0, item);
    }
    if (this.table) {
      this.table.renderRows();
    }
  }

  validateChildren() {
    const dialogRef = this.dialog.open(ChildrenValidationDialogComponent, {
      data: {
        parent: this.layout.selectedParentItem,
        children: this.layout.items,
        batchId: this.layout.getBatchId()
      },
      panelClass: 'app-children-validation-dialog',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  canAddChildren(): boolean {
    return this.layout.allowedChildrenModels() && this.layout.allowedChildrenModels().length > 0;
  }

  onCreateNewObject() {
    if (!this.canAddChildren()) {
      return;
    }
    const data: NewObjectData = {
      models: this.layout.allowedChildrenModels(),
      model: this.layout.allowedChildrenModels()[0],
      customPid: false,
      parentPid: this.layout.selectedParentItem.pid,
      fromNavbar: false
    }
    const dialogRef1 = this.dialog.open(NewObjectDialogComponent, { data: data });
    dialogRef1.afterClosed().subscribe((result: any) => {
      if (result && result['pid']) {

        if (result.isMultiple) {
          this.layout.setShouldRefresh(true);
        } else {
          const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
            disableClose: true,
            height: '90%',
            data: result.data
          });
          dialogRef.afterClosed().subscribe(res => {
            // console.log(res);
            if (res?.item) {
              const item = DocumentItem.fromJson(res.item);
              this.layout.items.push(item);
              if (res.gotoEdit) {
                // item.selected = true;
                // this.rowClick(item, this.layout.items.length - 1, null);

                this.router.navigate(['/repository', item.pid]);
              } else {
                item.selected = true;
                this.rowClick(item, this.layout.items.length - 1, null);
                this.layout.refreshSelectedItem(true, 'pages');
              }

            }
            // this.layout.setShouldRefresh(true);
          });
        }

      }
    });
  }

  showConvertDialog() {
    const dialogRef = this.dialog.open(ConvertDialogComponent, { data: { pid: this.layout.item.pid, model: this.layout.item.model, children: this.layout.items } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.status == 'ok') {
          this.layout.setShouldRefresh(false);
          this.ui.showInfoSnackBar("Strany byly převedeny");

        } else if (result.status == 'failure') {
          this.layout.setShouldRefresh(false);
          this.ui.showInfoSnackBar("Strany byly převedeny s chybou");
        }
      }
    });
  }

  onReindexChildren() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.reindex_dialog.title')),
      message: String(this.translator.instant('editor.children.reindex_dialog.message')),
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
        this.reindexChildren();
      }
    });
  }

  reindexChildren() {
    let pagePid = null;
    let model = null;
    for (const page of this.layout.items) {
      if (page.isPage()) {
        pagePid = page.pid;
        model = page.model;
        break;
      }
    }
    if (!pagePid) {
      return;
    }
    this.state = 'saving';
    this.api.reindexPages(this.layout.item.pid, pagePid, this.layout.getBatchId(), model).subscribe(result => {

      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
        this.state = 'error';
      } else if (result.response.data) {
        this.ui.showErrorDialogFromObject(result.response.data.map((d: any) => d.errorMessage = d.validation));
        this.state = 'error';
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar("Objekty byly reindexovány");
        this.layout.setShouldRefresh(false);
      }
    });
  }



  onRelocateOutside() {
    const selected = this.layout.getSelected();
    const items = selected.length > 0 ? selected : [this.layout.item];
    const parent = selected.length > 0 ? this.layout.item : this.layout.parent;

    const dialogRef = this.dialog.open(ParentDialogComponent, {
      data: {
        btnLabel: 'editor.children.relocate_label',
        parent: this.layout.item.parent,
        item: this.layout.item,
        items: this.layout.items,
        // expandedPath: this.expandedPath,
        displayedColumns: this.displayedColumns,
        isRepo: this.isRepo,
        batchId: this.layout.getBatchId()
      },
      width: '95%',
      maxWidth: '100vw',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.layout.setShouldRefresh(false);
      }
      // if (result && result.pid) {
      //   this.expandedPath = result.expandedPath;
      //   this.properties.setStringProperty('parent.expandedPath', JSON.stringify(this.expandedPath));
      //   // this.relocateOutside(items, result.pid);
      // } else if (result && result.delete) {
      //   // this.deleteParent(parent.pid);
      // }
    });
  }

  private deleteParent(parent: string) {
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
        if (this.layout.parent) {



          this.state = 'saving';
          this.api.deleteParent(this.layout.item.pid, parent).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorDialogFromObject(response['response'].errors);
              this.state = 'error';
              return;
            } else {
              this.state = 'success';

              this.layout.setShouldRefresh(true);
            }
          });
        }
      }
    });
  }


  private relocateOutside(items: DocumentItem[], destinationPid: string) {
    const checkbox = {
      label: String(this.translator.instant('editor.children.relocate_dialog.go')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.relocate_dialog.title')),
      message: String(this.translator.instant('editor.children.relocate_dialog.message')),
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
      },
      checkbox: checkbox
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (this.layout.getNumOfSelected() > 0 || this.layout.parent) {
          this.relocateObjects(items[0].parent, destinationPid, checkbox.checked);
        } else {
          this.setParent(destinationPid, checkbox.checked);
        }

      }
    });
  }

  setParent(destinationPid: string, openDestination: boolean) {
    this.state = 'saving';
    let pids: string[] = this.layout.items.filter(c => c.selected).map(c => c.pid);
    this.api.setParent(this.layout.item.pid, destinationPid).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.state = 'success';
        this.layout.setShouldRefresh(false);
      }
    });
  }

  setRelocationMode(enabled: boolean) {
    this.relocationMode = enabled;
  }

  switchRelocationMode() {
    this.setRelocationMode(!this.relocationMode);
  }

  relocateObjects(parentPid: string, destinationPid: string, openDestination: boolean) {
    this.state = 'saving';
    let pids: string[] = this.layout.items.filter(c => c.selected).map(c => c.pid);
    const isMultiple = this.layout.items.filter(c => c.selected).length > 1;

    this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      if (!openDestination) {
        this.setRelocationMode(false);
        let nextSelection = 0;
        for (let i = this.layout.items.length - 1; i >= 0; i--) {
          if (pids.indexOf(this.layout.items[i].pid) > -1) {
            this.layout.items.splice(i, 1);
            nextSelection = i - 1;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (this.layout.items.length > 0 && !isMultiple) {
          this.layout.setSelection(true);
        }
        this.layout.refreshSelectedItem(true, 'pages');
        this.state = 'success';
        // this.dataSource = new MatTableDataSource(this.layout.items);
      } else {
        this.goToObjectByPid(destinationPid);
      }
    });
  }

  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }



  onSave() {
    if (!this.hasChanges) {
      return;
    }

    this.state = 'saving';
    const pidArray = this.layout.items.map(item => item.pid);
    const request = this.isRepo ? this.api.editRelations(this.layout.selectedParentItem.pid, pidArray) : this.api.editBatchRelations(this.layout.selectedParentItem.pid, pidArray);
    request.subscribe((response: any) => {

      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.ui.showInfoDialog("V poradku")
        this.hasChanges = false;
        this.state = 'success';
      }
    });

  }


  onDelete() {
    const checkbox = {
      label: String(this.translator.instant('editor.children.delete_dialog.permanently')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.delete_dialog.title')),
      message: String(this.translator.instant('editor.children.delete_dialog.message')),
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
    if (this.isRepo && this.auth.isSuperAdmin()) {
      data.checkbox = checkbox;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteSelectedChildren(checkbox.checked);
      }
    });
  }

  deleteSelectedChildren(pernamently: boolean) {
    this.state = 'saving';
    let pids: string[] = this.layout.items.filter(c => c.selected).map(c => c.pid);
    // const isMultiple = this.layout.items.filter(c => c.selected).length > 1;
    // const first = this.layout.getFirstSelectedIndex();

    this.api.deleteObjects(pids, pernamently, this.layout.getBatchId()).subscribe((response: any) => {

      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        // const i = this.layout.items[first];
        // if (i) {
        //   this.rowClick(i, first, null);
        // }

        const removedPid: string[] = response['response']['data'].map((x: any) => x.pid);
        let nextSelection = 0;
        for (let i = this.layout.items.length - 1; i >= 0; i--) {
          if (removedPid.indexOf(this.layout.items[i].pid) > -1) {
            this.layout.items.splice(i, 1);
            nextSelection = i;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (nextSelection > this.layout.items.length - 1) {
          nextSelection = this.layout.items.length - 1;
        }
        if (this.layout.items.length > 0) {
          this.rowClick(this.layout.items[nextSelection], nextSelection, null);
        }


        // this.layout.setShouldRefresh(true);
        this.ui.showInfoSnackBar(String(this.translator.instant('editor.children.delete_dialog.success')));
        this.layout.refreshSelectedItem(true, 'pages');
        this.state = 'success';
      }

    });
  }

  onMove() {
    const fromIndex = this.layout.getFirstSelectedIndex();
    const input = {
      label: String(this.translator.instant('editor.children.move_dialog.position')),
      value: fromIndex + 1,
      min: 1,
      max: this.layout.items.length
    };
    const message = String(this.translator.instant('editor.children.move_dialog.message')) + ' (' +
      String(this.translator.instant('editor.children.move_dialog.between')) +
      ' ' + input.min + ' - ' + input.max + ')';
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.move_dialog.title')),
      message,
      alertClass: 'app-message',
      width: 400,
      btn1: {
        label: String(this.translator.instant('editor.children.move_dialog.move')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('common.cancel')),
        value: 'no',
        color: 'default'
      },
      numberInput: input
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const toIndex = input.value - 1;
        if (toIndex >= 0 && toIndex < this.layout.items.length) {
          this.reorder(fromIndex, input.value - 1);
        }
      }
    });
    // });
  }


  thumb(pid: string) {
    // return this.api.getThumbUrl(pid);
    return this.api.getStreamUrl(pid, 'THUMBNAIL', this.layout.getBatchId());
  }

  ingest() {
    this.onIngest.emit(true);
  }

  markSequence() {

    const dialogRef = this.dialog.open(MarkSequenceDialogComponent, {
      width: '95%',
      maxWidth: '100vw',
      height: '90%',
      data: {
        iconWidth: { orig: this.iconWidth, dest: this.iconWidth },
        iconHeight: { orig: this.iconHeight, dest: this.iconHeight },
        viewModeOrig: 'list',
        viewModeDest: 'icons',
        displayedColumns: this.displayedColumns,
        api: this.api,
        items: this.layout.items,
        batchId: this.layout.getBatchId()
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.layout.setShouldRefresh(true);
      }
    });
  }

  array_move(arr: any[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

  cdkDragStart(event: any) {
    this.layout.dragging = true;
  }

  cdkDragEnd(event: any) {
    this.layout.dragging = false;
  }

  drop1(event: any) {
    // Return the drag container to disabled.
    this.layout.dragging = false;
    this.dragDisabled = true;

    const selections: number[] = [];
    let indexCounted = false;

    // Get the indexes for all selected items
    this.layout.items.forEach((item, i) => {
      if (item.selected) {
        selections.unshift(i);
      }
    });

    const selected: DocumentItem[] = this.layout.items.filter(i => i.selected);

    if (selections.length > 1) {
      // If multiple selections exist
      let newIndex = event.currentIndex;
      selections.forEach(s => {
        this.layout.items.splice(s, 1);
        if (s < event.currentIndex) {
          newIndex--;
          indexCounted = true;
        }
      });
      if (indexCounted) {
        newIndex++;
      }
      this.layout.items.splice(newIndex, 0, ...selected);

    } else {
      // If a single selection
      moveItemInArray(this.layout.items, event.previousIndex, event.currentIndex);
    }
    this.layout.setIsDirty(this as Component);
    this.hasChanges = true;
    this.table.renderRows();

  }



  setColumnSizes() {

    this.selectedColumns.forEach((column) => {
        const col = document.getElementsByClassName('mat-column-' + column.field).item(0);
      if (col) {
        column.width = col.clientWidth;
        // this.setColumnWidth(column);
      }
    });
  }


}
