
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { ConvertDialogComponent } from '../convert-dialog/convert-dialog.component';

@Component({
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule],
  selector: 'app-change-model-dialog',
  templateUrl: './change-model-dialog.component.html',
  styleUrls: ['./change-model-dialog.component.scss']
})
export class ChangeModelDialogComponent implements OnInit {

  inProgress: boolean;

  destinations: any[] = [];

  constructor(
    private api: ApiService,
    private ui: UIService,
    private translator: TranslateService,
    public dialogRef: MatDialogRef<ConvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

  }

  change(dest: any) {
    this.inProgress = true;
    this.api.changeModel(this.data.pid, this.data.model, dest.apiPoint).subscribe((response: any) => {
      if (response.response.errors) {
        this.ui.showErrorDialogFromObject(response.response.errors);
        this.dialogRef.close({ status: 'failure' });
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.changeModel.success',{value: this.translator.instant('model.model:' + dest.model)})))
        this.dialogRef.close({ status: 'ok' });
      }
    });
  }

}
