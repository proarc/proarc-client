import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ReloadBatchDialogComponent } from '../reload-batch-dialog/reload-batch-dialog.component';

@Component({
  selector: 'app-resolve-conflict-dialog',
  templateUrl: './resolve-conflict-dialog.component.html',
  styleUrls: ['./resolve-conflict-dialog.component.scss']
})
export class ResolveConflictDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReloadBatchDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  useNew() {
    this.dialogRef.close({ useNewMetadata: true });
  }

  useOriginal() {
    this.dialogRef.close({ useNewMetadata: false });
  }

}
