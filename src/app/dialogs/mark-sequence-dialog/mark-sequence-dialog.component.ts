import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { ResizedEvent } from 'angular-resize-event';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-mark-sequence-dialog',
  templateUrl: './mark-sequence-dialog.component.html',
  styleUrls: ['./mark-sequence-dialog.component.scss']
})
export class MarkSequenceDialogComponent implements OnInit {

  orig: any[] = [];
  dest: any[] = [];
  origTable: any;
  destTable: any;
  // origViewMode = 'icons';
  // destViewMode = 'icons';
  meta: any;

  pageType: boolean = false;
  pageIndex: boolean = false;
  pageNumber: boolean = false;
  lastClickIdx: number = -1;
  changed = false;

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<MarkSequenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.data.items.forEach((item: DocumentItem) => {
      this.orig.push(JSON.parse(JSON.stringify(item)));
      this.dest.push(JSON.parse(JSON.stringify(item)));
      this.dest.forEach(i => i.selected = false);
      this.origTable = new MatTableDataSource(this.orig);
      this.destTable = new MatTableDataSource(this.dest);

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

  select(array: any[], item: DocumentItem, idx: number, event: MouseEvent) {
    if (event && (event.metaKey || event.ctrlKey)) {
      // Nesmi byt prazdna selecke pro import
      item.selected = !item.selected;
    } else if (event && event.shiftKey) {
      if (this.lastClickIdx > -1) {
        const from = Math.min(this.lastClickIdx, idx);
        const to = Math.max(this.lastClickIdx, idx);
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
    this.lastClickIdx = idx;
  }

  save() {
    const data = {
      sourcePids: this.orig.filter(i => i.selected).map(i => i.pid),
      destinationPids: this.dest.filter(i => i.selected).map(i => i.pid),
      copyPageIndex: this.pageIndex,
      copyPageNumber: this.pageNumber,
      copyPageType: this.pageType,
      batchId: this.data.batchId
    }
    this.api.saveMarkSequence(data).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorSnackBarFromObject(result.response.errors);
      } else {
        // this.dialogRef.close(this.changed);
        this.ui.showInfo('editor.children.markSequenceSaved')
        this.changed = true;
      }
    })
  }

}
