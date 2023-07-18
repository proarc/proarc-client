
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  templateUrl: './convert-dialog.component.html',
  styleUrls: ['./convert-dialog.component.scss']
})
export class ConvertDialogComponent implements OnInit {

  inProgress: boolean;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ConvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.inProgress = false;    
  }

  convert(type: string) {
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
