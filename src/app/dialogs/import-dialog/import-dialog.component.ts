
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit, OnDestroy {

  public count = 0;
  public done = 0;

  private timer;
  private batchId;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {
      this.batchId = data;
      console.log('batchId', this.batchId);
  }

  ngOnInit() {
    this.timer= setInterval(() => {
      this.onTick();
    }, 1000);
  }


  onTick() {
    this.api.getImportBatchStatus(this.batchId).subscribe((status: [number, number]) => {
      this.done = status[0];
      this.count = status[1];
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onDone() {
    clearInterval(this.timer);
    this.dialogRef.close('hotovo');
  }


}
