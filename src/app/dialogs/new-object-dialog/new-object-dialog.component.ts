
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Uuid } from 'src/app/utils/uuid';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-new-object-dialog',
  templateUrl: './new-object-dialog.component.html',
  styleUrls: ['./new-object-dialog.component.scss']
})
export class NewObjectDialogComponent implements OnInit {

  state = 'none';

  constructor(
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: NewObjectData) { }

  ngOnInit() {
  }


  validate(): boolean {
    return !this.data.customPid || Uuid.validate(this.data.pid);
  }

  onCreate() {
    this.state = 'saving';
    const customPid = this.data.customPid ? this.data.pid : null;      
    this.api.createObject(this.data.model, customPid, this.data.parentPid).subscribe((pid: string) => {
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
  models: string[];
  customPid: boolean;
  parentPid?: string;
  pid?: string;
}
