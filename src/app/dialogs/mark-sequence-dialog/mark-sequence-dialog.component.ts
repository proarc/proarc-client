import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { DocumentItem } from 'src/app/model/documentItem.model';

@Component({
  selector: 'app-mark-sequence-dialog',
  templateUrl: './mark-sequence-dialog.component.html',
  styleUrls: ['./mark-sequence-dialog.component.scss']
})
export class MarkSequenceDialogComponent implements OnInit {

  orig: any[] = [];
  dest: any[] = [];
  meta: any;

  pageType: boolean;
  pageIndex: boolean;
  pageNumber: boolean;

  constructor(
    public dialogRef: MatDialogRef<MarkSequenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
     this.data.items.forEach((item: DocumentItem) => {
      this.orig.push({
        label: item.label, pid: item.pid, selected: item.selected
      });
      this.dest.push({
        label: item.label, pid: item.pid, selected: false
      });
      
    })
  }

  save() {

  }

}
