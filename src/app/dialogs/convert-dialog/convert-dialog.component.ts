
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {UIService} from '../../services/ui.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './convert-dialog.component.html',
  styleUrls: ['./convert-dialog.component.scss']
})
export class ConvertDialogComponent implements OnInit {

  inProgress: boolean;

  constructor(
    private api: ApiService,
    private ui: UIService,
    private translator: TranslateService,
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
    // this.api.convertPages(this.data.pid, this.data.model, type).subscribe(result => {
    //   console.log('ok', result);
    //   this.dialogRef.close( { status: 'ok' } );
    // },
    // (error) => {
    //   console.log('error', error);
    //   this.dialogRef.close( { status: 'failure' } );
    // });
    this.api.convertPages(this.data.pid, this.data.model, type).subscribe((response: any) => {
      if (response.response.errors) {
        this.ui.showErrorDialogFromObject(response.response.errors);
        // this.dialogRef.close({status: 'failure'});
      } else if (response.response.data && response.response.data[0] && response.response.data[0].validation) {
        this.ui.showErrorDialogFromString(response.response.data[0].validation);
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.changeModel.success',{value: this.translator.instant('model.model:' + this.data.model)})))
        this.dialogRef.close({ status: 'ok' });
      }
    })
  }

}
