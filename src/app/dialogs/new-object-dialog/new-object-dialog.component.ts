
import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Uuid } from 'src/app/utils/uuid';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { UIService } from 'src/app/services/ui.service';
import { CatalogDialogComponent } from '../catalog-dialog/catalog-dialog.component';

@Component({
  selector: 'app-new-object-dialog',
  templateUrl: './new-object-dialog.component.html',
  styleUrls: ['./new-object-dialog.component.scss']
})
export class NewObjectDialogComponent implements OnInit {

  state = 'none';
  isMultiple: boolean;
  seriesPartNumberFrom: number;
  seriesDateFrom: Date;
  seriesDateTo: Date;
  seriesDaysIncluded: number[] = [];
  weekDays = [1,2,3,4,5,6,7];

  constructor(
    public adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: NewObjectData) { }

  ngOnInit() {
  }


  validate(): boolean {
    return !this.data.customPid || Uuid.validate(this.data.pid);
  }

  onCreate() {

    this.state = 'saving';
    const customPid = this.data.customPid ? this.data.pid : null;

    let data = `model=${this.data.model}`;
    if (customPid) {
      data = `${data}&pid=${customPid}`;
    }
    if (this.data.parentPid) {
      data = `${data}&parent=${this.data.parentPid}`;
    }

    if (this.isMultiple) {
      data += '&seriesPartNumberFrom='+this.seriesPartNumberFrom;
      data += '&seriesDateFrom='+ this.datePipe.transform(this.seriesDateFrom, 'yyyy-MM-dd');
      data += '&seriesDateTo='+this.datePipe.transform(this.seriesDateTo, 'yyyy-MM-dd');
      this.seriesDaysIncluded.forEach(d => {
        data += '&seriesDaysIncluded='+d;
      });
    }

    this.api.createObject(data).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      const pid =  response['response']['data'][0]['pid'];
      this.dialogRef.close({pid: pid})
    },
    (error) => {
      console.log('error', error);
      this.state = 'error';
    });
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full', create: true } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.state = 'saving';
        const customPid = this.data.customPid ? this.data.pid : null;
    
        let data = `model=${this.data.model}`;
        if (customPid) {
          data = `${data}&pid=${customPid}`;
        }
        data = `${data}&xml=${result.mods}`;
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorSnackBarFromObject(response['response'].errors);
            this.state = 'error';
            return;
          }
          const pid =  response['response']['data'][0]['pid'];
          this.state = 'success';
          this.dialogRef.close({pid: pid});
        },
        (error) => {
          console.log('error', error);
          this.state = 'error';
        });
      }
    });
  }

}

export interface NewObjectData {
  model: string;
  models: string[];
  customPid: boolean;
  parentPid?: string;
  pid?: string;
  cislood?: string;
}
