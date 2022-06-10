import { UIService } from 'src/app/services/ui.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { DocumentItem } from 'src/app/model/documentItem.model';
import { EditorService } from 'src/app/services/editor.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ResizedEvent } from 'angular-resize-event';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';
import { ConvertDialogComponent } from 'src/app/dialogs/convert-dialog/convert-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { Tree } from 'src/app/model/mods/tree.model';



@Component({
  selector: 'app-editor-children',
  templateUrl: './editor-children.component.html',
  styleUrls: ['./editor-children.component.scss']
})
export class EditorChildrenComponent implements OnInit, AfterViewInit {

  @Input() items: DocumentItem[];

  @ViewChild('childrenList') childrenListEl: ElementRef;
  @ViewChild('childrenIconList') childrenIconListEl: ElementRef;
  @ViewChild('childrenGridList') childrenGridListEl: ElementRef;
  @ViewChild('childrenWrapper') childrenWrapperEl: ElementRef;

  viewMode = 'none'; // 'list' | 'grid' | 'icons'
  shortLabels = false;

  source: any;
  sourceNext: any;
  dragEnabled = false;
  sourceIndex: number;

  anyChange: boolean;

  pageChildren = false;
  lastIndex: number;
  lastState: boolean;

  movedToIndex: boolean;
  arrowIndex: number;

  iconColumns: number;
  iconWidth: number;
  iconHeight: number;

  isDragging = false;

  lastSelectedParent: DocumentItem;
  lastSelectedTree: Tree;

  constructor(public editor: EditorService,
    private dialog: MatDialog,
    private translator: TranslateService,
    private ui: UIService,
    private api: ApiService,
    public auth: AuthService,
    private properties: LocalStorageService) {
  }

  ngAfterViewInit() {
    this.childrenWrapperEl.nativeElement.focus();
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
        this.select(this.items[this.arrowIndex - step], event);
      }
    } else if (event.keyCode === 39 || event.keyCode === 40) {
      event.stopPropagation();
      event.preventDefault();
      let step = 1;
      if (event.keyCode === 40 && (this.viewMode === 'icons' || this.viewMode === 'grid')) {
        step = this.iconColumns;
      }
      if (this.arrowIndex + step < this.items.length) {
        this.select(this.items[this.arrowIndex + step], event);
      }
    }

  }

  ngOnInit() {
    this.iconColumns = 1;
    this.movedToIndex = false;
    this.lastIndex = 0;
    this.arrowIndex = 0;
    this.lastState = true;
    this.anyChange = false;
    this.pageChildren = this.editor.anyPageChildren();
    if (this.pageChildren) {
      this.viewMode = this.properties.getStringProperty('children.page_view_mode', 'icons');
    } else {
      this.viewMode = this.properties.getStringProperty('children.view_mode', 'list');
    }
    this.shortLabels = this.properties.getBoolProperty('children.short_labels', false);
  }

  thumb(pid: string) {
    // return this.api.getThumbUrl(pid);
    return this.api.getStreamUrl(pid, 'THUMBNAIL', this.editor.getBatchId());
  }

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

  switchUseShortLabel() {
    this.shortLabels = !this.shortLabels;
    this.properties.setBoolProperty('children.short_labels', this.shortLabels);

  }

  changeViewMode(mode: string) {
    this.viewMode = mode;
    if (this.pageChildren) {
      this.properties.setStringProperty('children.page_view_mode', this.viewMode);
    } else {
      this.properties.setStringProperty('children.view_mode', this.viewMode);
    }
    this.childrenWrapperEl.nativeElement.focus();
  }

  open(item: DocumentItem) {
    if (!this.editor.preparation) {
      this.editor.goToObject(item);
    }
  }

  isSelected(item: DocumentItem, index: number, type: string) {
    if (this.editor.isMultipleChildrenMode()) {
      return item.selected;
    } else {
      const selected = this.editor.right === item;
      if (!this.movedToIndex && selected) {
        let container;
        if (type == 'grid') {
          container = this.childrenGridListEl;
        } else if (type == 'icons') {
          container = this.childrenIconListEl;
        } else {
          container = this.childrenListEl;
        }
        if (container) {
          this.movedToIndex = true;
          if (index > 0) {
            this.arrowIndex = index;
            const el = container.nativeElement.children[index];
            el.scrollIntoView(true);
          }
        }
      }
      return selected;
    }
  }



  select(item: DocumentItem, event: any = null) {
    const itemIndex = this.items.indexOf(item);
    this.childrenWrapperEl.nativeElement.focus();
    if (event && event.shiftKey && this.lastIndex > -1) {
      if (!this.editor.isMultipleChildrenMode()) {
        this.editor.setMultipleChildrenMode(true);
      }
      let firstIndex = this.editor.children.findIndex(i => i.selected === true);
      this.editor.children.map(i => i.selected = false);
      // let index = Math.min(this.lastIndex, itemIndex);
      let index = Math.max(firstIndex, 0);
      // let i2 = Math.max(this.lastIndex, itemIndex);
      let i2 = itemIndex;
      if (index > i2) {
        const temp = index;
        index = i2;
        i2 = temp;
      }
      // console.log(index, i2, this.lastState)
      while (index <= i2) {
        // this.editor.children[index].selected = this.lastState;
        this.editor.children[index].selected = true;
        index += 1;
      }
    } else if (event && (event.metaKey || event.ctrlKey)) {
      if (this.editor.isMultipleChildrenMode()) {
        this.lastState = !item.selected;
        item.selected = this.lastState;
      } else {
        this.editor.setMultipleChildrenMode(true);
        item.selected = true;
      }
    } else {
      if (this.editor.isMultipleChildrenMode()) {
        this.editor.setSingleChildMode(item);
      }
      item.selected = true;
      this.lastState = true;
    }
    if (this.editor.numberOfSelectedChildren() === 0) {
      this.editor.selectRight(this.editor.left);
    } else if (this.editor.numberOfSelectedChildren() === 1) {
      this.editor.selectRight(this.editor.children.find(ch => ch.selected));
    }

    this.arrowIndex = itemIndex;
    this.lastIndex = itemIndex;
    this.editor.lastSelected = item;
  }


  dragstart(event: any) {
    if (!this.dragEnabled) {
      return;
    }
    this.source = event.currentTarget;
    this.sourceNext = event.currentTarget.nextSibling;
    this.sourceIndex = this.getIndex(this.source);
    if (this.editor.isMultipleChildrenMode() && !this.editor.children[this.sourceIndex - 1].selected) {
      this.dragEnabled = false;
      event.preventDefault();
      return;
    }
    if (!this.editor.isMultipleChildrenMode()) {
      this.select(this.items[this.sourceIndex - 1]);
    }
    this.isDragging = true;
    event.dataTransfer.effectAllowed = 'move';
  }

  mousedown(event: any) {
    // if (this.viewMode !== 'list' || $event.target.classList.contains('app-drag-handle') > 0) {
    //   this.dragEnabled = true;
    // } else {
    //   $event.preventDefault();
    //   this.dragEnabled = false;
    // }
    this.dragEnabled = true;
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
    const targetIndex = this.getIndex(this.source);
    let to = targetIndex - 1;
    this.source.parentNode.insertBefore(this.source, this.sourceNext);
    if (this.editor.isMultipleChildrenMode()) {
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
      this.anyChange = true;
    } else {
      const from = this.sourceIndex - 1;
      if (from !== to) {
        this.reorder(from, to);
      }
    }
  }

  drop(event: any) {
    if (!this.dragEnabled) {
      return;
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
    this.anyChange = true;
  }

  reorder(from: number, to: number) {
    if (this.editor.isMultipleChildrenMode()) {
      this.reorderMultiple(to+1);
    } else {
      this.anyChange = true;
      const item = this.items[from];
      this.items.splice(from, 1);
      this.items.splice(to, 0, item);
    }
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.editor.saveChildren(() => {
      this.anyChange = false;
    });
  }

  onSelectColumns() {

  }

  onCreateNewObject() {
    this.editor.onCreateNewObject();
  }

  showConvertDialog() {
    const dialogRef = this.dialog.open(ConvertDialogComponent, { data: { pid: this.editor.left.pid, model: this.editor.left.model, children: this.editor.children } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.status == 'ok') {
          this.editor.reloadChildren(() => {
            this.ui.showInfoSnackBar("Strany byly převedeny");
          });
        } else if (result.status == 'failure') {
          this.editor.reloadChildren(() => {
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
        this.editor.reindexChildren();
      }
    });
  }

  onRelocate() {
    this.editor.switchRelocationMode();
  }

  onRelocateOutside() {
    const selected = this.editor.getSelectedChildren();
    const items = selected.length > 0 ? selected : [this.editor.left];
    const parent = selected.length > 0 ? this.editor.left : this.editor.parent;
    const dialogRef = this.dialog.open(ParentDialogComponent, { 
      data: { 
        btnLabel: 'editor.children.relocate_label', 
        parent, 
        items,
        selectedItem: this.lastSelectedParent,
        selectedTree: this.lastSelectedTree
      } 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.pid) {
        this.lastSelectedParent = result.selectedItem;
        this.lastSelectedTree = result.selectedTree;
        this.relocateOutside(items, result.pid);
      } else if(result && result.delete) {
        this.deleteParent(this.editor.parent.pid);
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
        if (this.editor.parent) {
          this.editor.deleteParent(parent);
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
        if (this.editor.numberOfSelectedChildren() > 0 || this.editor.parent) {
          this.editor.relocateObjects(items[0].parent, destinationPid, checkbox.checked);
        } else {
          this.editor.setParent(destinationPid, checkbox.checked);
        }
        
      }
    });
  }


  onMove() {
    // this.translator.waitForTranslation().then(() => {
      const fromIndex = this.editor.children.indexOf(this.editor.right);
      const input = {
        label: String(this.translator.instant('editor.children.move_dialog.position')),
        value: fromIndex + 1,
        min: 1,
        max: this.editor.children.length
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
          if (toIndex >= 0 && toIndex < this.editor.children.length) {
            this.reorder(fromIndex, input.value - 1);
          }
        }
      });
    // });
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
    if (!this.editor.preparation && this.auth.isSuperAdmin()) {
      data.checkbox = checkbox;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.editor.deleteSelectedChildren(checkbox.checked, (success: boolean) => {
          if (success) {
            this.ui.showInfoSnackBar(String(this.translator.instant('editor.children.delete_dialog.success')));
          }
        });
      }
    });
  }

  isColumnSelected(field: string) {
    return this.editor.selectedColumns.findIndex(c => c.field === field && c.selected) > -1;
  }
}
