
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProArc } from 'src/app/utils/proarc';
import { Uuid } from 'src/app/utils/uuid';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-new-object-dialog',
  templateUrl: './new-object-dialog.component.html',
  styleUrls: ['./new-object-dialog.component.scss']
})
export class NewObjectDialogComponent implements OnInit {

  models = ProArc.models;
  state = 'none';

  constructor(
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }


  validate(): boolean {
    return !this.data.customPid || Uuid.validate(this.data.pid);
  }

  onCreate() {
    this.state = 'saving';
    const pid = this.data.customPid ? this.data.pid : null;      
    this.api.createObject(this.data.model, pid).subscribe((pid: string) => {
      this.dialogRef.close({pid: pid})
    },
    (error) => {
      console.log('error', error);
      this.state = 'error';
    });
  }

}

export interface NewObjectData {
  model: string;
  customPid: boolean;
  pid?: string;
}
