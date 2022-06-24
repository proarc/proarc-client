
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
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

  filteredModels: string[];

  constructor(
    public adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: NewObjectData) { }

  ngOnInit() {
    this.filteredModels = this.data.models.filter(f => f.indexOf('page') < 0);
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
      // tady vytvorime a rovnou ulozime
      data += '&seriesPartNumberFrom='+this.seriesPartNumberFrom;
      data += '&seriesDateFrom='+ this.datePipe.transform(this.seriesDateFrom, 'yyyy-MM-dd');
      data += '&seriesDateTo='+this.datePipe.transform(this.seriesDateTo, 'yyyy-MM-dd');
      this.seriesDaysIncluded.forEach(d => {
        data += '&seriesDaysIncluded='+d;
      });
    } else {
      // jen pripravime pro editace
      data = `${data}&createObject=false`;
    }

    this.api.createObject(data).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      this.state = 'success';
      const pid =  response['response']['data'][0]['pid'];
      this.dialogRef.close({pid: pid, data: response['response']['data'][0], isMultiple: this.isMultiple})
    });
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full', create: true } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.state = 'saving';
        const customPid = this.data.customPid ? this.data.pid : null;
    
        let data = `model=${this.data.model}&createObject=false`;
        //let data = `model=${this.data.model}`;
        if (customPid) {
          data = `${data}&pid=${customPid}`;
        }
        data = `${data}&xml=${encodeURIComponent(result.mods)}`;
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            this.ui.showErrorSnackBarFromObject(response['response'].errors);
            this.state = 'error';
            return;
          }
          const pid =  response['response']['data'][0]['pid'];
          this.state = 'success';
          this.dialogRef.close({pid: pid, data: response['response']['data'][0]});
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
