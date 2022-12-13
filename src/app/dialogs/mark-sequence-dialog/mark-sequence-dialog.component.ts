import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { ResizedEvent } from 'angular-resize-event';
import { DocumentItem } from 'src/app/model/documentItem.model';

@Component({
  selector: 'app-mark-sequence-dialog',
  templateUrl: './mark-sequence-dialog.component.html',
  styleUrls: ['./mark-sequence-dialog.component.scss']
})
export class MarkSequenceDialogComponent implements OnInit {

  orig: any[] = [];
  dest: any[] = [];
  // origViewMode = 'icons';
  // destViewMode = 'icons';
  meta: any;

  pageType: boolean;
  pageIndex: boolean;
  pageNumber: boolean;
  lastClickIdx: number = -1;

  constructor(
    public dialogRef: MatDialogRef<MarkSequenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
     this.data.items.forEach((item: DocumentItem) => {
      this.orig.push(JSON.parse(JSON.stringify(item)));
      this.dest.push(JSON.parse(JSON.stringify(item)));
      this.dest.forEach(i => i.selected = false);
      
    })
  }

  onResized(event: ResizedEvent, data: string) {
    const d = event.newRect.width / 101;
    const iconColumns = Math.floor(d);
    this.data.iconHeight[data] = ((event.newRect.width - 4.0) / iconColumns) * 1.47;
    this.data.iconWidth[data] = 100.0 / iconColumns;
  }

  thumb(pid: string) {
    return this.data.api.getStreamUrl(pid, 'THUMBNAIL', this.data.batchId);
  }

  select(item: DocumentItem, idx: number, event: MouseEvent){
    if (event && (event.metaKey || event.ctrlKey)) {
      // Nesmi byt prazdna selecke pro import
      item.selected = !item.selected;
    } else if (event && event.shiftKey) {
      if (this.lastClickIdx > -1) {
        const from = Math.min(this.lastClickIdx, idx);
        const to = Math.max(this.lastClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.dest[i].selected = true;
        }
      } else {
        // nic neni.
        this.dest.forEach(i => i.selected = false);
        item.selected = true;
      }

    } else {
      this.dest.forEach(i => i.selected = false);
      item.selected = true;
    }
    this.lastClickIdx = idx;
  }

  save() {

  }

}
