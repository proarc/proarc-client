import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ConvertDialogComponent } from '../convert-dialog/convert-dialog.component';

@Component({
  selector: 'app-change-model-dialog',
  templateUrl: './change-model-dialog.component.html',
  styleUrls: ['./change-model-dialog.component.scss']
})
export class ChangeModelDialogComponent implements OnInit {

  inProgress: boolean;

  destinations: any[] = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ConvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }

  ngOnInit() {
    
  }

  convert(type: any) {
    console.log('convert, ', type);
    this.inProgress = true;
    this.api.convertPages(this.data.pid, this.data.model, type).subscribe(result => {
      console.log('ok', result);
      this.dialogRef.close( { status: 'ok' } );
    },
    (error) => {
      console.log('error', error);
      this.dialogRef.close( { status: 'failure' } );
    });
  }

}
