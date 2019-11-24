import { UIService } from 'src/app/services/ui.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ActivatedRoute } from '@angular/router';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { EditorService } from 'src/app/services/editor.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatDialog } from '@angular/material';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';



@Component({
  selector: 'app-editor-children',
  templateUrl: './editor-children.component.html',
  styleUrls: ['./editor-children.component.scss']
})
export class EditorChildrenComponent implements OnInit {

  @Input() items: DocumentItem[];

  viewMode = 'none'; // 'list' | 'grid' | 'icons'
  shortLabels = false;

  source: any;
  dragEnabled = false;
  sourceIndex: number;

  anyChange: boolean;

  pageChildren = false;
  lastIndex: number;
  lastState: boolean;

  constructor(public editor: EditorService,
              private dialog: MatDialog,
              private ui: UIService,
              private api: ApiService,
              private properties: LocalStorageService) {
  }

  ngOnInit() {
    this.lastIndex = -1;
    this.lastState = false;
    this.anyChange = false;
    this.pageChildren = this.editor.onlyPageChildren();
    if (this.pageChildren) {
      this.viewMode = this.properties.getStringProperty('children.page_view_mode', 'icons');
    } else {
      this.viewMode = this.properties.getStringProperty('children.view_mode', 'list');
    }
    this.shortLabels = this.properties.getBoolProperty('children.short_labels', false);
  }

  thumb(pid: string) {
    return this.api.getThumbUrl(pid);
  }

  private getIndex(el) {
    return Array.prototype.indexOf.call(el.parentNode.childNodes, el);
  }

  private isbefore(a, b) {
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
  }

  open(item: DocumentItem) {
    if (!this.editor.isMultipleChildrenMode()) {
      this.editor.goToObject(item);
    }
  }

  isSelected(item: DocumentItem) {
    if (this.editor.isMultipleChildrenMode()) {
      return item.selected;
    } else {
      return this.editor.right === item;
    }
  }



  select(item: DocumentItem, event = null) {
    console.log('event', event);
    const itemIndex = this.items.indexOf(item);
    if (event && event.shiftKey && this.lastIndex > -1) {
      if (!this.editor.isMultipleChildrenMode()) {
        this.editor.setMultipleChildrenMode(true);
      }
      let index = Math.min(this.lastIndex, itemIndex);
      const i2 = Math.max(this.lastIndex, itemIndex);
      while (index <= i2) {
        console.log('index', index);
        this.editor.children[index].selected = this.lastState;
        index += 1;
      }
    } else {
      if (this.editor.isMultipleChildrenMode()) {
        this.lastState = !item.selected;
        item.selected = this.lastState;
      } else {
        if (event.metaKey || event.ctrlKey) {
          this.editor.setMultipleChildrenMode(true);
          item.selected = true;
        } else {
          this.editor.selectRight(item);
        }
        this.lastState = true;
      }
    }
    this.lastIndex = itemIndex;
  }


  // select(item: DocumentItem, event = null) {
  //   console.log('event', event);
  //   if (this.editor.isMultipleChildrenMode()) {
  //     const itemIndex = this.items.indexOf(item);
  //     if (event && event.shiftKey && this.lastIndex > -1) {
  //       let index = Math.min(this.lastIndex, itemIndex);
  //       const i2 = Math.max(this.lastIndex, itemIndex);
  //       while (index <= i2) {
  //         this.editor.children[index].selected = this.lastState;
  //         index += 1;
  //       }
  //     } else {
  //       this.lastState = !item.selected;
  //       this.lastIndex = itemIndex;
  //       item.selected = this.lastState;
  //     }
  //   } else {
  //     this.editor.selectRight(item);
  //   }
  // }

  dragenter($event) {
    if (this.source.parentNode !== $event.currentTarget.parentNode) {
      return;
    }
    const target = $event.currentTarget;
    if (this.isbefore(this.source, target)) {
      target.parentNode.insertBefore(this.source, target); // insert before
    } else {
      target.parentNode.insertBefore(this.source, target.nextSibling); // insert after
    }
  }

  dragend($event) {
    const targetIndex = this.getIndex(this.source);
    const from = this.sourceIndex - 1;
    const to = targetIndex - 1;
    if (from !== to) {
      console.log('reoredr ' + from + ' and ' + to);
      this.reorder(from, to);
    }
  }


  reorder(from: number, to: number) {
    this.anyChange = true;
    const item = this.items[from];
    this.items.splice(from, 1);
    this.items.splice(to, 0, item);
    console.log(this.items);
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.editor.saveChildren(() => {
      this.anyChange = false;
    });
    // const pidArray = this.items.map( item => item.pid);
    // this.api.editRelations(this.parentPid, pidArray).subscribe(result => {
    //   console.log('result', result);
    // });
  }

  onDelete() {
    const checkbox = {
      label: 'Smazat trvale z uložiště',
      checked: false
    };
    const data: SimpleDialogData = {
      title: 'Smazání objektů',
      message: 'Opravdu chcete vybrané objekty smazat?',
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      checkbox: checkbox
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        console.log('delete, pernamently: ', checkbox.checked);
        this.editor.deleteSelectedChildren(checkbox.checked, (success: boolean) => {
          if (success) {
            this.ui.showInfoSnackBar('Objekty byly smazány');
          }
        });
      }
    });
  }

  dragstart($event) {
    if (!this.dragEnabled) {
      return;
    }
    this.source = $event.currentTarget;
    this.sourceIndex = this.getIndex(this.source);
    $event.dataTransfer.effectAllowed = 'move';
  }

  mousedown($event) {
    if (this.viewMode !== 'list' || $event.target.classList.contains('app-drag-handle') > 0) {
      this.dragEnabled = true;
    } else {
      $event.preventDefault();
      this.dragEnabled = false;
    }
  }


}
