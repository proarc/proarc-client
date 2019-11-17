import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ActivatedRoute } from '@angular/router';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { EditorService } from 'src/app/services/editor.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';



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

  constructor(public editor: EditorService, private api: ApiService, private properties: LocalStorageService) {
  }

  ngOnInit() {
    this.anyChange = false;
    this.pageChildren = this.editor.document.onlyPageChildren();
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

  onItemClicked(item: DocumentItem) {
    this.editor.goToObject(item);
  }

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
    console.log('on save');
    this.editor.saveChildren(() => {
      this.anyChange = false;
    });
    // const pidArray = this.items.map( item => item.pid);
    // this.api.editRelations(this.parentPid, pidArray).subscribe(result => {
    //   console.log('result', result);
    // });
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
    if ($event.target.classList.contains('app-drag-handle') > 0) {
      this.dragEnabled = true;
    } else {
      $event.preventDefault();
      this.dragEnabled = false;
    }
  }


}
