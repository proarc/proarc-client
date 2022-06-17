
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit, OnDestroy {

  state = 'loading';

  public count = 0;
  public done = 0;

  private timer: any;
  private batchId;

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.batchId = data.batch;
  }

  ngOnInit() {
    this.state = 'loading';
    this.timer = setInterval(() => {
      this.onTick();
    }, 1000);
  }

  onTick() {
    this.api.getImportBatchStatus(this.batchId).subscribe((response: any) => {
      console.log(response)
      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorSnackBarFromObject(response.response.errors);
        clearInterval(this.timer);
        this.state = 'failure';
        return;
      }

      const status: [number, number] = Batch.statusFromJson(response['response']);

      this.done = status[0];
      this.count = status[1];
      if (this.done === this.count) {
        this.onLoaded();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private onLoaded() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.state = 'success';
  }


}
