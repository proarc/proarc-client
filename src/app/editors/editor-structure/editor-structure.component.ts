

import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, ViewChildren, ViewContainerRef, QueryList, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ConvertDialogComponent } from '../../dialogs/convert-dialog/convert-dialog.component';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from '../../model/documentItem.model';
import { ResizecolDirective } from '../../resizecol.directive';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { ModelTemplate } from '../../model/modelTemplate';
import { Configuration } from '../../shared/configuration';
import { ResizedEvent } from 'angular-resize-event';


@Component({
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule, FlexLayoutModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule, 
    MatTableModule, MatSortModule, ResizecolDirective],
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
  isAkubra: boolean;

  lastClickIdx: number = -1;
  startShiftClickIdx: number = -1;
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

  public columnSize: number;

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
  colsImport: any;
  colsWidth: { [key: string]: string } = {};

  subscriptions: Subscription[] = [];

  refreshing = false;

  constructor(
    private router: Router,
    public settings: UserSettings,
    private settingsService: UserSettingsService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private ui: UIService,
    private api: ApiService,
    public auth: AuthService,
    public layout: LayoutService,
    public config: Configuration
  ) { 
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.isRepo = this.layout.type === 'repo';
    this.setSelectedColumns();

    this.api.getInfo().subscribe((info) => {
      this.isAkubra = info.storage === 'Akubra';
    });

    this.pageChildren = this.layout.items().findIndex(it => it.isPage()) > -1;
    if (!this.isRepo) {
      this.lastClickIdx = 0;
      this.startShiftClickIdx = 0;
    }
    // this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
    //   const selection = this.layout.items().filter(i => i.selected).map(i => i.pid);
    //   this.refreshChildren(selection);
    // }));
    
  }

  refreshChildren(selection: string[]) {
    this.layout.setItems([]);
    this.api.getRelations(this.layout.selectedParentItem.pid).subscribe((children: DocumentItem[]) => {
      this.layout.setItems(children);
      if (this.layout.lastSelectedItem) {
        const item = this.layout.items().find(item => item.pid === this.layout.lastSelectedItem().pid);
        if (item) {
          item.selected = true;
        }
      }
      
      this.layout.items().forEach(item => {
        item.selected = selection.includes(item.pid);
      })
      
    });
  }

  ngAfterViewInit() {
    this.childrenWrapperEl.nativeElement.focus();
    // this.setColumnSizes();
    
    // this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
    //   this.pageChildren = this.layout.items().findIndex(it => it.isPage()) > -1;
    //   if (!fromStructure) {
    //     this.arrowIndex = this.layout.getFirstSelectedIndex();
    //     this.obtainFocus();
    //   }
    //   if (this.table) {
    //     this.table.renderRows();
    //   }

    // }));

    // this.layout.moveToNext().subscribe((idx: number) => {
    //   this.moveToNext(idx);
    // });
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

  isInViewport(element: any) {
    const rect = element.getBoundingClientRect();
    const parentRect = this.childrenListEl.nativeElement.getBoundingClientRect();
    return (
        rect.top >= parentRect.top &&
        rect.bottom <= (parentRect.bottom)
    );
  }

  scrollToSelected(align: string) {
    const index = this.layout.items().findIndex(i => i.selected);
    console.log(index)
    if (index < 0) {
      return;
    }
    let container: any;
    if (this.viewMode == 'grid') {
      container = this.childrenGridListEl;
    } else if (this.viewMode == 'icons') {
      container = this.childrenIconListEl;
    } else {
      let row = this.rows.get(index);
      if (!this.isInViewport(row.element.nativeElement)) {
        row.element.nativeElement.scrollIntoView({ block: align, behavior: 'smooth' });
      }
      
      return;
    }

    if (container) {
      if (index >= 0) {
        const el = container.nativeElement.children[index];
        if (!this.isInViewport(el)) {
          el.scrollIntoView({ block: align, behavior: 'smooth' });
        }
        
      }
    }
  }

  scrollToLastClicked() {
    if (!this.rows) {
      return;
    }
    const index = this.layout.lastItemIdxClicked;
    if (index < 0) {
      return;
    }
    let container: any;
    if (this.viewMode == 'grid') {
      container = this.childrenGridListEl;
    } else if (this.viewMode == 'icons') {
      container = this.childrenIconListEl;
    } else {
      // let row = this.rows.get(index);
      let row = this.rows.find(tr => tr.element.nativeElement.id === 'tr_' + index);
      if (row && !this.isInViewport(row.element.nativeElement)) {

        setTimeout(() => {
          row.element.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 100);
      }

      return;
    }


    if (container) {
      if (index >= 0) {
        const el = container.nativeElement.children[index];
        if (!this.isInViewport(el)) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
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

  noscroll(e: any) {
    if (this.viewMode === 'list' && ["Space", "ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  }

  // navigate by keyboard
  keyup(event: any) {
    if (!event) {
      return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
      event.stopPropagation();
      event.preventDefault();
      this.layout.moveFocus = false;
    }
    if (event.code === "ArrowUp") {
      let step = 1;
      if (this.viewMode !== 'list') {
        step = this.iconColumns;
      }
      if (this.arrowIndex - step >= 0) {
        this.rowClick(this.layout.items()[this.arrowIndex - step], this.arrowIndex - step, event);
        this.scrollToSelected('center');
      }
    } else if (event.code === "ArrowLeft" && this.viewMode !== 'list') {
      let step = 1;
      if (this.arrowIndex - step >= 0) {
        this.rowClick(this.layout.items()[this.arrowIndex - step], this.arrowIndex - step, event);
        this.scrollToSelected('center');
      }
    } else if (event.code === "ArrowDown") {
      let step = 1;
      if (this.viewMode !== 'list') {
        step = this.iconColumns;
      }
      if (this.arrowIndex + step < this.layout.items().length) {
        this.rowClick(this.layout.items()[this.arrowIndex + step], this.arrowIndex + step, event);
        this.scrollToSelected('end');
      }
    } else if (event.code === "ArrowRight" && this.viewMode !== 'list') {
      let step = 1;
      if (this.arrowIndex + step < this.layout.items().length) {
        this.rowClick(this.layout.items()[this.arrowIndex + step], this.arrowIndex + step, event);
        this.scrollToSelected('end');
        //this.scrollToSelected();
      }
    }

  }

  moveToNext(index: number) {
    if (index < this.layout.items().length) {
      this.rowClick(this.layout.items()[index], index, null);
    }
  }

  changeViewMode(view: string) {
    this.viewMode = view;
    this.panel.type = 'structure-' + view;
    const l = this.isRepo ? 'repo' : 'import';
    this.settingsService.save();
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
    this.setColumnsWith();
  }

  setColumnsWith() {
    this.colsWidth = {};
    let model;

    if (!this.layout.selectedParentItem) {
      if (this.layout.items().length > 0) {
        model = this.layout.items()[0].model;
      } else {
        model = this.layout.lastSelectedItem().model;
      }
    } else if (this.layout.items().length > 0) {
      model = this.settings.colsEditModeParent ? this.layout.selectedParentItem.model : this.layout.items()[0].model;
    } else {
      model = this.layout.selectedParentItem.model
    }


    if (this.isRepo) {
      this.settings.colsEditingRepo[model].forEach(c => {
        this.colsWidth[c.field] = c.width + 'px';
      })
    } else {
      this.settings.colsEditingImport.forEach((c: any) => {
        this.colsWidth[c.field] = c.width + 'px';
      })
    }
  }

  getColumnWidth(field: string) {
    if (this.isRepo) {
      return this.getColumnWidthRepo(field);
    } else {
      return this.getColumnWidthImport(field);
    }
  }
  getColumnWidthRepo(field: string) {
    const model = this.settings.colsEditModeParent ? this.layout.selectedParentItem.model : this.layout.items()[0].model;
    const el = this.settings.colsEditingRepo[model].find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  getColumnWidthImport(field: string) {
    const el = this.colsImport.find((c: any) => c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizes(e: any, field?: string) {
    if (this.isRepo) {
      this.saveColumnsSizesRepo(e, field);
    } else {
      this.saveColumnsSizesImport(e, field);
    }
  }

  saveColumnsSizesRepo(e: any, field?: string) {
    const model = this.settings.colsEditModeParent ? this.layout.selectedParentItem.model : this.layout.items()[0].model;
    const el = this.settings.colsEditingRepo[model].find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }

    this.settingsService.save();
  }

  saveColumnsSizesImport(e: any, field?: string) {
    const el = this.colsImport.find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    }

    this.settingsService.save();
  }

  setSelectedColumnsRepo() {
    const models: string[] = [];
    this.layout.items().forEach(i => {
      if (!models.includes(i.model)) {
        models.push(i.model);
      }
    });
    this.displayedColumns = [];
    if (this.settings.colsEditModeParent && this.layout.selectedParentItem?.model) {
      this.displayedColumns = this.settings.colsEditingRepo[this.layout.selectedParentItem.model].filter(c => c.selected && !this.displayedColumns.includes(c.field)).map(c => c.field);
    } else {
      models.forEach(model => {
        const f = this.settings.colsEditingRepo[model].filter(c => c.selected && !this.displayedColumns.includes(c.field)).map(c => c.field);
        this.displayedColumns.push(...f);
      });
    }
  }

  setSelectedColumnsImport() {
    this.colsImport = this.settings.colsEditingImport;
    this.displayedColumns = this.colsImport.filter((c: any) => c.selected).map((c: any) => c.field);
  }

  selectAll() {
    this.layout.items().forEach(i => i.selected = true);
    this.layout.setSelection(true, null);
  }

  // selectColumns() {
  //   const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
  //     data: {
  //       type: 'structure',
  //       isRepo: this.isRepo,
  //       isImport: !this.isRepo,
  //       itemModel: this.layout.item.model,
  //       selectedModel: this.layout.lastSelectedItem().model,
  //       selectedParentModel: this.layout.selectedParentItem.model,
  //     },
  //     width: '600px',
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.layout.setShouldRefresh(false);
  //     }
  //   });
  // }

  rowClick(row: DocumentItem, idx: number, event: MouseEvent) {
    this.layout.moveFocus = false;
    if (event && (event.metaKey || event.ctrlKey)) {
      // Nesmi byt prazdna selecke pro import
      if (this.layout.type === 'import' && row.selected && this.layout.getNumOfSelected() === 1) {
        this.layout.setLastSelectedItem(row);
        return;
      } else {
        row.selected = !row.selected;
      }
      this.startShiftClickIdx = idx;
    } else if (event && event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.layout.items()[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, idx);
        const to = Math.max(this.startShiftClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.layout.items()[i].selected = true;
        }
      } else {
        // nic neni.
        this.layout.items().forEach(i => i.selected = false);
        row.selected = true;
       this.startShiftClickIdx = idx;
      }

    } else {
      this.layout.items().forEach(i => i.selected = false);
      row.selected = true;
      this.startShiftClickIdx = idx;
    }
    this.lastClickIdx = idx;
    // this.layout.lastSelectedItem = row;
    if (row.selected) {
      this.layout.setLastSelectedItem(row);
    } else {
      const last = this.layout.items().filter((i: DocumentItem) => i.selected);
      if (last.length > 0) {
        this.layout.setLastSelectedItem(last[last.length - 1]);
      }
    }
    this.layout.lastItemIdxClicked = this.lastClickIdx;
    this.layout.lastPanelClicked = this.panel.id;
    this.layout.setSelection(true, null);
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
    this.router.navigate(['/repository', this.layout.items()[0].pid]);
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
    this.stop = true;
  }

  mousemove(event: any) {
  }

  dragstart(item: DocumentItem, idx: number, event: any) {
    this.stop = true;
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
    this.stop = true;
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



  stop = true;
  h = 0;
  y = 0;

  scroll(el: any, step: number) {
    var scrollTop = el.scrollTop;
    el.scrollTop = scrollTop + step;
    if (!this.stop) {
      setTimeout(() => { this.scroll(el, step) }, 20);
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


    // console.log(event)
    // this.h = event.clientY;
    // this.y = event.offsetY;
    this.stop = true;
    if (event.clientY < (this.childrenListEl.nativeElement.offsetTop + 45)) {
      this.stop = false;
      this.scroll(this.childrenListEl.nativeElement, -1)
    }
    if (event.clientY > (this.childrenListEl.nativeElement.offsetTop + this.childrenListEl.nativeElement.clientHeight - 45)) {
      this.stop = false;
      this.scroll(this.childrenListEl.nativeElement, 1)
    }

    return false;
  }


  dragend(event: any) {
    this.stop = true;
    this.isDragging = false;
    if (!this.dragEnabled) {
      return;
    }

    const isMultiple = this.layout.getNumOfSelected() > 1;

    const targetIndex = this.getIndex(this.source);
    let to = targetIndex;
    to = this.targetIndex;
    this.layout.lastItemIdxClicked = to;
    // this.source.parentNode.insertBefore(this.source, this.sourceNext);
    if (isMultiple) {
      this.dropMultiple();
    } else {
      const from = this.sourceIndex;
      this.hasChanges = true;
      if (from !== to) {
        this.reorder(from, to);
      }
    }
    this.layout.setSelectionChanged(true, this.panel);
  }

  public trackItem(index: number, item: DocumentItem) {
    return item.pid;
  }

  dropMultiple() {
    const scPos = this.childrenListEl.nativeElement.scrollTop;
    const selections: number[] = [];
    let indexCounted = false;

    // Get the indexes for all selected items
    this.layout.items().forEach((item, i) => {
      if (item.selected) {
        selections.unshift(i);
      }
    });

    const selected: DocumentItem[] = this.layout.items().filter(i => i.selected);
    if (selections.length > 1) {
      let newIndex = this.targetIndex;
      selections.forEach(s => {
        const item = this.layout.items().splice(s, 1);
        if (s < this.targetIndex) {
          newIndex--;
          indexCounted = true;
        }
      });
      if (indexCounted) {
        newIndex++;
      }
      this.layout.items().splice(newIndex, 0, ...selected);

    } else {
      // If a single selection
      moveItemInArray(this.layout.items(), this.sourceIndex, this.targetIndex);
    }
    this.hasChanges = true;
    if (this.table) {
      this.table.renderRows();
    }

    this.state = 'loading';
    setTimeout(() => {
      this.state = 'success';
    }, 1);
    setTimeout(() => {
      this.childrenListEl.nativeElement.scrollTop = scPos;
      // this.scrollToSelected('start');
    }, 2);
  }

  reorder(from: number, to: number) {
    this.hasChanges = true;
    if (this.layout.getNumOfSelected() > 1) {
      // this.reorderMultiple(to + 1);
    } else {
      const item = this.layout.items()[from];
      this.layout.items().splice(from, 1);
      this.layout.items().splice(to, 0, item);
    }
    if (this.table) {
      this.table.renderRows();
    }
  }

  validateChildren() {
    // const dialogRef = this.dialog.open(ChildrenValidationDialogComponent, {
    //   data: {
    //     parent: this.layout.selectedParentItem,
    //     children: this.layout.items,
    //     batchId: this.layout.batchId
    //   },
    //   panelClass: 'app-children-validation-dialog',
    //   width: '600px'
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }


  canAddChildren(): boolean {
    return this.layout.allowedChildrenModels() && this.layout.allowedChildrenModels().length > 0;
  }

  onCreateNewObject() {
    // if (!this.canAddChildren()) {
    //   return;
    // }
    // const data: NewObjectData = {
    //   models: this.layout.allowedChildrenModels(),
    //   model: this.layout.allowedChildrenModels()[0],
    //   customPid: false,
    //   parentPid: this.layout.selectedParentItem.pid,
    //   fromNavbar: false
    // }
    // const dialogRef1 = this.dialog.open(NewObjectDialogComponent, {
    //   data: data,
    //   width: '680px',
    //   panelClass: 'app-dialog-new-bject'
    // });
    // dialogRef1.afterClosed().subscribe((result: any) => {
    //   if (result && result['pid']) {

    //     if (result.isMultiple) {
    //       this.layout.setShouldRefresh(true);
    //     } else {
    //       const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
    //         disableClose: true,
    //         height: '90%',
    //         width: '680px',
    //         data: result.data
    //       });
    //       dialogRef.afterClosed().subscribe(res => {
    //         // console.log(res);
    //         if (res?.item) {
    //           const item = DocumentItem.fromJson(res.item);


    //           if (res.gotoEdit) {
    //             this.router.navigate(['/repository', item.pid]);
    //           } else {
    //             if(result.objectPosition === 'after') {
    //               this.layout.items().splice(this.lastClickIdx+1, 0, item);
    //               this.hasChanges = true;
    //             } else {
    //               this.layout.items().push(item);
    //             }
    //             item.selected = true;
    //             this.rowClick(item, this.layout.items().length - 1, null);
    //             if (this.table) {
    //               this.table.renderRows();
    //             }
    //             if(result.objectPosition === 'after') {
    //               this.onSave();
    //               setTimeout(() => {
    //                 this.scrollToSelected('center');
    //               }, 1000);
    //             } else {
    //               setTimeout(() => {
    //                 this.scrollToSelected('end');
    //               }, 1000);
    //             }
    //             this.layout.refreshSelectedItem(true, 'pages');
    //           }

    //         }
    //         // this.layout.setShouldRefresh(true);
    //       });
    //     }

    //   }
    // });
  }

  showConvertDialog() {
    const dialogRef = this.dialog.open(ConvertDialogComponent, { data: { pid: this.layout.item.pid, model: this.layout.item.model } });
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
    for (const page of this.layout.items()) {
      if (page.isPage()) {
        pagePid = page.pid;
        model = page.model;
        break;
      }
    }
    if (!pagePid) {
      return;
    }
    this.state = 'loading';
    this.api.reindexPages(this.layout.item.pid, pagePid, this.layout.batchId, model).subscribe(result => {

      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
        this.state = 'error';
      } else if (result.response.data && result.response.data[0].status !== 'OK') {
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

    // const dialogRef = this.dialog.open(ParentDialogComponent, {
    //   data: {
    //     btnLabel: 'editor.children.relocate_label',
    //     parent: this.layout.item.parent,
    //     item: this.layout.item,
    //     items: this.layout.items,
    //     expandedPath: this.layout.expandedPath,
    //     displayedColumns: this.displayedColumns,
    //     isRepo: this.isRepo,
    //     batchId: this.layout.batchId
    //   },
    //   width: '95%',
    //   maxWidth: '100vw',
    //   height: '90%',
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.layout.setShouldRefresh(false);
    //   }
      
    // });
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
    let pids: string[] = this.layout.items().filter(c => c.selected).map(c => c.pid);
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
    let pids: string[] = this.layout.items().filter(c => c.selected).map(c => c.pid);
    const isMultiple = this.layout.items().filter(c => c.selected).length > 1;

    this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      if (!openDestination) {
        this.setRelocationMode(false);
        let nextSelection = 0;
        for (let i = this.layout.items().length - 1; i >= 0; i--) {
          if (pids.indexOf(this.layout.items()[i].pid) > -1) {
            this.layout.items().splice(i, 1);
            nextSelection = i - 1;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (this.layout.items().length > 0 && !isMultiple) {
          this.layout.setSelection(true, this.panel);
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
    const pidArray = this.layout.items().map(item => item.pid);
    const request = this.isRepo ? this.api.editRelations(this.layout.selectedParentItem.pid, pidArray) : this.api.editBatchRelations(this.layout.selectedParentItem.pid, pidArray);
    request.subscribe((response: any) => {

      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.ui.showErrorSnackBar(String(this.translator.instant('snackbar.saveTheChange.error')));
        this.state = 'error';
        return;
      } else {
        //this.ui.showInfoDialog("V poradku");
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.saveTheChange.success')));
        this.hasChanges = false;
        this.state = 'success';
        this.layout.clearPanelEditing();
      }
    });

  }


  onDelete() {
    let pids= this.layout.items().filter(c => c.selected);
    const checkbox = {
      label: String(this.translator.instant('dialog.removeObject.checkbox')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.removeObject.title')),
      message: String(this.translator.instant('dialog.removeObject.message')) + ": " + pids.length  + '?',
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
    this.state = 'loading';
    let pids: string[] = this.layout.items().filter(c => c.selected).map(c => c.pid);
    // const isMultiple = this.layout.items().filter(c => c.selected).length > 1;
    // const first = this.layout.getFirstSelectedIndex();

    this.api.deleteObjects(pids, pernamently, this.layout.batchId).subscribe((response: any) => {

      if (response['response'].errors) {
        //this.ui.showErrorDialogFromObject(response['response'].errors);
        const data: SimpleDialogData = {
          title: String(this.translator.instant('dialog.deleteSelectedChildren.error.title')),
          message: String(this.translator.instant('dialog.deleteSelectedChildren.error.message')),
          alertClass: 'app-warn',
          btn1: {
            label: String(this.translator.instant('button.close')),
            value: 'close',
            color: 'deffault'
          }
        };
        const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
        this.state = 'error';
        return;
      } else {
        // const i = this.layout.items()[first];
        // if (i) {
        //   this.rowClick(i, first, null);
        // }

        const removedPid: string[] = response['response']['data'].map((x: any) => x.pid);
        let nextSelection = 0;
        for (let i = this.layout.items().length - 1; i >= 0; i--) {
          if (removedPid.indexOf(this.layout.items()[i].pid) > -1) {
            this.layout.items().splice(i, 1);
            nextSelection = i;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (nextSelection > this.layout.items().length - 1) {
          nextSelection = this.layout.items().length - 1;
        }
        if (this.layout.items().length > 0) {
          this.rowClick(this.layout.items()[nextSelection], nextSelection, null);
        }


        // this.layout.setShouldRefresh(true);
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.deleteSelectedChildren.success')));
        this.layout.refreshSelectedItem(true, 'pages');
        this.state = 'success';
      }

    });
  }

  onMove() {
    const fromIndex = this.layout.items().findIndex(i => i.selected);
    const input = {
      label: String(this.translator.instant('editor.children.move_dialog.position')),
      value: fromIndex + 1,
      min: 1,
      max: this.layout.items().length
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
        if (toIndex >= 0 && toIndex < this.layout.items().length) {
          this.reorder(fromIndex, input.value - 1);
        }
        this.layout.setPanelEditing(this.panel)
      }
    });
  }


  thumb(pid: string) {
    // return this.api.getThumbUrl(pid);
    return this.api.getStreamUrl(pid, 'THUMBNAIL', this.layout.batchId);
  }

  ingest() {
    this.onIngest.emit(true);
  }

  markSequence() {

    // const dialogRef = this.dialog.open(MarkSequenceDialogComponent, {
    //   width: '95%',
    //   maxWidth: '100vw',
    //   height: '90%',
    //   data: {
    //     iconWidth: { orig: this.iconWidth, dest: this.iconWidth },
    //     iconHeight: { orig: this.iconHeight, dest: this.iconHeight },
    //     viewModeOrig: 'list',
    //     viewModeDest: 'icons',
    //     displayedColumns: this.displayedColumns,
    //     api: this.api,
    //     items: this.layout.items,
    //     batchId: this.layout.batchId
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.layout.setShouldRefresh(true);
    //   }
    // });
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


  setColumnSizes() {

    this.selectedColumns.forEach((column) => {
      const col = document.getElementsByClassName('mat-column-' + column.field).item(0);
      if (col) {
        column.width = col.clientWidth;
        // this.setColumnWidth(column);
      }
    });
  }

  onResize(e: any) {
    this.columnSize = e.newRect.width;
    //console.log(e.newRect.width);
  }

}
