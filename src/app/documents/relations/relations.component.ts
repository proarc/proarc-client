import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from './../../model/documentItem.model';
import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss']
})
export class RelationsComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];

  parentPid: string;

  layout = 'table';

  source: any;
  dragEnabled = false;
  sourceIndex: number;

  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.parentPid = params['id'];
      this.api.getRelations(this.parentPid).subscribe((items: DocumentItem[]) => {
        this.items = items;
        this.state = 'success';
      });
    });
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
      this.reorder(from, to);
      this.save();
    }
  }


  reorder(from: number, to: number) {
    const item = this.items[from];
    this.items.splice(from, 1);
    this.items.splice(to, 0, item);
  }

  save() {
    const pidArray = this.items.map( item => item.pid);
    this.api.editRelations(this.parentPid, pidArray).subscribe(result => {
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
    // if ($event.target.classList.contains('page-drag-handle') > 0) {
      this.dragEnabled = true;
    // } else {
      // $event.preventDefault();
      // this.dragEnabled = false;
    // }
  }


}
