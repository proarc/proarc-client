
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Uuid } from 'src/app/utils/uuid';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { UIService } from 'src/app/services/ui.service';
import { CatalogDialogComponent } from '../catalog-dialog/catalog-dialog.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

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
  releasedInRange: number[] = [];
  weekDays = [1,2,3,4,5,6,7];
  seriesSignatura: string;

  dateFormats = ['dd.mm.yyyy', 'mm.yyyy','yyyy'];
  dateFormat: string = 'dd.mm.yyyy';


  frequences = ['other', 'd','w','hm','m','qy','hy','y'];
  frequency: string = 'w';

  filteredModels: string[];

  dateFrom = new FormControl(moment());

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

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateFrom.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dateFrom.setValue(ctrlValue);
    // this.seriesDateTo = ctrlValue;
    // datepicker.close();
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

      this.releasedInRange.forEach(d => {
        data += '&seriesDaysInRange='+d;
      });

      if (this.seriesSignatura) {
        data += '&seriesSignatura='+this.seriesSignatura;
      }

      data += '&seriesFrequency='+this.frequency;
      data += '&seriesDateFormat='+this.dateFormat;
    } else {
      // jen pripravime pro editace
      data = `${data}&createObject=false&validate=false`;
    }

    this.api.createObject(data).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      this.state = 'success';
      const pid =  response['response']['data'][0]['pid'];
      this.dialogRef.close({pid: pid, data: response['response']['data'][0], isMultiple: this.isMultiple});

    });
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, {
      data: { type: 'full', create: true } ,
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.state = 'saving';
        const customPid = this.data.customPid ? this.data.pid : null;

        let data = `model=${this.data.model}&createObject=false`;
        //let data = `model=${this.data.model}`;
        if (customPid) {
          data = `${data}&pid=${customPid}`;
        }
        if (this.data.parentPid) {
          data = `${data}&parent=${this.data.parentPid}`;
        }
        data = `${data}&xml=${encodeURIComponent(result.mods)}`;
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            this.ui.showErrorDialogFromObject(response['response'].errors);
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
  fromNavbar: boolean;
}
