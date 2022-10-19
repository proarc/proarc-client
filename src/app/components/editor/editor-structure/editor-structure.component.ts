
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResizedEvent } from 'angular-resize-event';
import { ChildrenValidationDialogComponent } from 'src/app/dialogs/children-validation-dialog/children-validation-dialog.component';
import { ConvertDialogComponent } from 'src/app/dialogs/convert-dialog/convert-dialog.component';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-structure',
  templateUrl: './editor-structure.component.html',
  styleUrls: ['./editor-structure.component.scss']
})
export class EditorStructureComponent implements OnInit {

  @Input() items: DocumentItem[];
  @ViewChild('table') table: MatTable<DocumentItem>;
  @ViewChild('childrenWrapper') childrenWrapperEl: ElementRef;

  public state = 'none';
  isRepo: boolean = true;

  lastClickIdx: number = -1;
  rows: DocumentItem[] = [];

  source: any;
  sourceNext: any;
  dragEnabled = true;
  sourceIndex: number;
  isDragging = false;

  movedToIndex: boolean;
  arrowIndex: number;

  iconColumns: number;
  iconWidth: number;
  iconHeight: number;

  viewMode = 'none'; // 'list' | 'grid' | 'icons'
  shortLabels = false;
  pageChildren = false;

  expandedPath: string[];
  parent: DocumentItem | null;
  public relocationMode: boolean;

  hasChanges: boolean = false;

  public selectedColumns = [
    { field: 'label', selected: true },
    { field: 'model', selected: true },
    { field: 'pid', selected: false },
    { field: 'owner', selected: false },
    { field: 'created', selected: false },
    { field: 'modified', selected: true },
    { field: 'status', selected: false }
  ];
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(
    private router: Router,
    private properties: LocalStorageService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private ui: UIService,
    private api: ApiService,
    public auth: AuthService,
    public layout: LayoutService,
    public repo: RepositoryService
    ) { }

  ngOnInit(): void {
    this.isRepo = this.layout.type === 'repo';
    this.initSelectedColumns();
    this.setColumns();
    this.shortLabels = this.properties.getBoolProperty('children.short_labels', false);
    this.pageChildren = this.items.findIndex(it => it.isPage()) > -1;
    if (this.pageChildren) {
      this.viewMode = this.properties.getStringProperty('children.page_view_mode', 'icons');
    } else {
      this.viewMode = this.properties.getStringProperty('children.view_mode', 'list');
    }
  }

  ngOnChanges(e: any) {
    if (this.items) {
      this.dataSource = new MatTableDataSource(this.items);
      // this.rows = JSON.parse(JSON.stringify(this.items));
    }
  }

  obtainFocus() {
    this.childrenWrapperEl.nativeElement.focus();
  }

  

  onResized(event: ResizedEvent) {
    const d = event.newRect.width / 101;
    this.iconColumns = Math.floor(d);
    // const c = 1 + d - this.iconColumns; 

    this.iconHeight = ((event.newRect.width - 4.0) / this.iconColumns) * 1.47;
    this.iconWidth = 100.0 / this.iconColumns;
    // this.iconColumnHeight = 
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
        this.rowClick(this.items[this.arrowIndex - step], this.arrowIndex - step, event);
      }
    } else if (event.keyCode === 39 || event.keyCode === 40) {
      event.stopPropagation();
      event.preventDefault();
      let step = 1;
      if (event.keyCode === 40 && (this.viewMode === 'icons' || this.viewMode === 'grid')) {
        step = this.iconColumns;
      }
      if (this.arrowIndex + step < this.items.length) {
        this.rowClick(this.items[this.arrowIndex + step], this.arrowIndex + step, event);
      }
    }

  }

  switchUseShortLabel() {
    this.shortLabels = !this.shortLabels;
    this.properties.setBoolProperty('children.short_labels', this.shortLabels);
  }

  changeViewMode(view: string) {
    this.viewMode = view;
  }

  initSelectedColumns() {
    const prop = this.properties.getStringProperty('selectedColumns');
    if (prop) {
      this.selectedColumns = JSON.parse(prop);
    }
  }

  setSelectedColumns() {
    this.properties.setStringProperty('selectedColumns', JSON.stringify(this.selectedColumns));
  }

  setColumns() {
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field)
  }

  rowClick(row: DocumentItem, idx: number, event: MouseEvent) {
    if (event && (event.metaKey || event.ctrlKey)) {
      row.selected = !row.selected;
      this.layout.setSelection();
    } else if (event && event.shiftKey) {
      if (this.lastClickIdx > -1) {
        const from = Math.min(this.lastClickIdx, idx);
        const to = Math.max(this.lastClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.items[i].selected = true;
        }
        this.layout.setSelection();
      } else {
        // nic neni.
        this.items.forEach(i => i.selected = false);
        row.selected = true;
        this.layout.setSelection();
      }

    } else {
      this.items.forEach(i => i.selected = false);
      row.selected = true;
      this.layout.setSelection();
    }
    this.lastClickIdx = idx;
  }

  open(item: DocumentItem) {
    console.log(item.pid)
    this.repo.goToObject(item);
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

  dragstart(item: DocumentItem, idx: number, event: any) {
    if (!this.dragEnabled) {
      return;
    }
    const isMultiple = this.repo.getNumOfSelected() > 1;
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
  }

  dragenter(event: any) {
    if (!this.dragEnabled || this.source.parentNode !== event.currentTarget.parentNode) {
      return;
    }
    const target = event.currentTarget;
    if (this.isbefore(this.source, target)) {
      target.parentNode.insertBefore(this.source, target); // insert before
    } else {
      target.parentNode.insertBefore(this.source, target.nextSibling); // insert after
    }
  }

  dragover(event: any) {
    event.preventDefault();
  }


  dragend(event: any) {
    this.isDragging = false;
    if (!this.dragEnabled) {
      return;
    }
    const isMultiple = this.repo.getNumOfSelected() > 1;
    const targetIndex = this.getIndex(this.source);
    let to = targetIndex;
    this.source.parentNode.insertBefore(this.source, this.sourceNext);
    if (isMultiple) {
      const movedItems = [];
      let shift = 0;
      for (let i = this.items.length - 1; i >= 0; i--) {
        if (this.items[i].selected) {
          const item = this.items.splice(i, 1);
          movedItems.push(item[0]);
          if (i < to) {
            shift += 1;
          }
        }
      }
      if (shift > 1) {
        to = to - shift + 1;
      }
      const rest = this.items.splice(to, this.items.length - to);
      for (let i = movedItems.length - 1; i >= 0; i--) {
        this.items.push(movedItems[i]);
      }
      for (let i = 0; i < rest.length; i++) {
        const item = rest[i];
        this.items.push(item);
      }
      this.repo.setIsDirty(this as Component);
      this.table.renderRows();
    } else {
      const from = this.sourceIndex;
      console.log(from, to);
      if (from !== to) {
        this.reorder(from, to);
      }
    }
  }

  reorderMultiple(to: number) {
    const movedItems = [];
    let shift = 0;
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].selected) {
        const item = this.items.splice(i, 1);
        movedItems.push(item[0]);
        if (i < to) {
          shift += 1;
        }
      }
    }
    if (shift > 1) {
      to = to - shift + 1;
    }
    const rest = this.items.splice(to, this.items.length - to);
    for (let i = movedItems.length - 1; i >= 0; i--) {
      this.items.push(movedItems[i]);
    }
    for (let i = 0; i < rest.length; i++) {
      const item = rest[i];
      this.items.push(item);
    }
    this.repo.setIsDirty(this as Component);
    this.table.renderRows();
  }

  reorder(from: number, to: number) {
    if (this.repo.getNumOfSelected() > 1) {
      this.reorderMultiple(to + 1);
    } else {
      this.repo.setIsDirty(this as Component);
      const item = this.items[from];
      this.items.splice(from, 1);
      this.items.splice(to, 0, item);
    }
    this.table.renderRows();
  }

  getBatchId() {
    return this.isRepo ? null : '';
  }

  validateChildren() {
    const dialogRef = this.dialog.open(ChildrenValidationDialogComponent, { data: { children: this.items, batchId: this.getBatchId() } });
    dialogRef.afterClosed().subscribe(result => {
    });
  }




  onCreateNewObject() {
    this.repo.onCreateNewObject();
  }

  showConvertDialog() {
    const dialogRef = this.dialog.open(ConvertDialogComponent, { data: { pid: this.repo.item.pid, model: this.repo.item.model, children: this.items } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.status == 'ok') {
          this.repo.reloadChildren(() => {
            this.ui.showInfoSnackBar("Strany byly převedeny");
          });
        } else if (result.status == 'failure') {
          this.repo.reloadChildren(() => {
            this.ui.showInfoSnackBar("Strany byly převedeny s chybou");
          });
        }
      }
    });
  }

  onReindexChildren() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.reindex_dialog.title')),
      message: String(this.translator.instant('editor.children.reindex_dialog.message')),
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
        this.repo.reindexChildren();
      }
    });
  }



  onRelocateOutside() {
    const selected = this.repo.getSelected();
    const items = selected.length > 0 ? selected : [this.repo.item];
    const parent = selected.length > 0 ? this.repo.item : this.parent;



    if (this.properties.getStringProperty('parent.expandedPath')) {
      this.expandedPath = JSON.parse(this.properties.getStringProperty('parent.expandedPath'));
    }

    const dialogRef = this.dialog.open(ParentDialogComponent, {
      data: {
        btnLabel: 'editor.children.relocate_label',
        parent,
        items,
        expandedPath: this.expandedPath,
      },
      width: '90%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.pid) {
        this.expandedPath = result.expandedPath;

        this.properties.setStringProperty('parent.expandedPath', JSON.stringify(this.expandedPath));

        this.relocateOutside(items, result.pid);
      } else if (result && result.delete) {
        this.deleteParent(parent.pid);
      }
    });
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
        if (this.parent) {



          this.state = 'saving';
          this.api.deleteParent(this.layout.pid, parent).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorSnackBarFromObject(response['response'].errors);
              this.state = 'error';
              return;
            } else {
              this.state = 'success';

              // this.init(
              //   {
              //     pid: this.layout.pid,
              //     preparation: false,
              //     metadata: null,
              //     isNew: false
              //   });

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
        if (this.layout.getNumOfSelected() > 0 || this.parent) {
          this.relocateObjects(items[0].parent, destinationPid, checkbox.checked);
        } else {
          this.setParent(destinationPid, checkbox.checked);
        }

      }
    });
  }

  setParent(destinationPid: string, openDestination: boolean) {
    this.state = 'saving';
    let pids: string[] = this.items.filter(c => c.selected).map(c => c.pid);
    this.api.setParent(this.layout.pid, destinationPid).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.state = 'success';
        // this.init(
        //   {
        //     pid: this.layout.pid,
        //     preparation: false,
        //     metadata: null,
        //     isNew: false
        //   });
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
    let pids: string[] = this.items.filter(c => c.selected).map(c => c.pid);
    const isMultiple = this.items.filter(c => c.selected).length > 1;

    this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      if (!openDestination) {
        this.setRelocationMode(false);
        let nextSelection = 0;
        for (let i = this.items.length - 1; i >= 0; i--) {
          if (pids.indexOf(this.items[i].pid) > -1) {
            this.items.splice(i, 1);
            nextSelection = i - 1;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (this.items.length > 0 && !isMultiple) {
          this.layout.setSelection();
        }
        this.state = 'success';
        // this.goToObjectByPid(destinationPid);
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
    const pidArray = this.items.map(item => item.pid);
    const request = this.isRepo ? this.api.editRelations(this.layout.pid, pidArray) : this.api.editBatchRelations(this.layout.pid, pidArray);
    request.subscribe((response: any) => {

      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      this.hasChanges = false;
      this.state = 'success';
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
    let pids: string[] = this.items.filter(c => c.selected).map(c => c.pid);
    const isMultiple = this.items.filter(c => c.selected).length > 1;

    this.api.deleteObjects(pids, pernamently, this.getBatchId()).subscribe((response: any) => {

      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        const removedPid: string[] = response['response']['data'].map((x: any) => x.pid);
        let nextSelection = 0;
        for (let i = this.items.length - 1; i >= 0; i--) {
          if (removedPid.indexOf(this.items[i].pid) > -1) {
            this.items.splice(i, 1);
            nextSelection = i - 1;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (this.items.length > 0 && !isMultiple) {
          this.layout.setSelection();
        }
        this.ui.showInfoSnackBar(String(this.translator.instant('editor.children.delete_dialog.success')));
        this.state = 'success';
      }

    });
  }

  onMove() {
    const fromIndex = this.items.indexOf(this.repo.getFirstSelected());
    const input = {
      label: String(this.translator.instant('editor.children.move_dialog.position')),
      value: fromIndex + 1,
      min: 1,
      max: this.items.length
    };
    const message = String(this.translator.instant('editor.children.move_dialog.message')) + ' (' +
      String(this.translator.instant('editor.children.move_dialog.between')) +
      ' ' + input.min + ' - ' + input.max + ')';
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.move_dialog.title')),
      message,
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
        if (toIndex >= 0 && toIndex < this.items.length) {
          this.reorder(fromIndex, input.value - 1);
        }
      }
    });
    // });
  }

}
