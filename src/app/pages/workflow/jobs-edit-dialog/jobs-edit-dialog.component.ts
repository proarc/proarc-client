import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-jobs-edit-dialog',
  templateUrl: './jobs-edit-dialog.component.html',
  styleUrls: ['./jobs-edit-dialog.component.scss']
})
export class JobsEditDialogComponent implements OnInit {

  state: string;
  priority: string;
  financed: string;
  note: string;

  constructor(
    public dialogRef: MatDialogRef<JobsEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {pids: string[]; states: any[]; priorities: any[]}) { }

  ngOnInit(): void {
  }

  onClose() {

  }

  onSave() {

  }

}
