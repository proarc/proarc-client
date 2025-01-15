
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Uuid } from 'src/app/utils/uuid';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { UIService } from 'src/app/services/ui.service';
import { CatalogDialogComponent } from '../catalog-dialog/catalog-dialog.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { WorkFlowProfile } from 'src/app/model/workflow.model';


export class MultiDateFormat {
  value = '';
  constructor() { }
  get display() {
    switch (this.value) {
      case 'mm.yyyy':
        return {
          dateInput: 'MM.YYYY',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'MM.YYYY',
          monthYearA11yLabel: 'MM YYYY',
        };
      case 'yyyy':
        return {
          dateInput: 'YYYY',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'MM.YYYY',
          monthYearA11yLabel: 'MM YYYY',
        };
      default:
        return {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        }
    }

  }
  get parse() {
    switch (this.value) {
      case 'mm.yyyy':
        return {
          dateInput: 'MM.YYYY'
        };
      case 'yyyy':
        return {
          dateInput: 'YYYY'
        };
      default:
        return {
          dateInput: 'DD.MM.YYYY'
        }
    }

  }
}


@Component({
  selector: 'app-new-object-dialog',
  templateUrl: './new-object-dialog.component.html',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MultiDateFormat }],
  styleUrls: ['./new-object-dialog.component.scss']
})
export class NewObjectDialogComponent implements OnInit {

  state = 'none';
  isMultiple: boolean;


  // frequences = ['other', 'd','w','hm','m','qy','hy','y'];
  frequences = ['other', 'd', 'w', 'hm', 'm', 'qy'];
  frequency = new FormControl();
  // frequency: string = null;

  seriesTotalNumbers = new FormControl();

  withPartNumber: boolean;
  withDateIssued: boolean;

  seriesPartNumberFrom = new FormControl();
  seriesDateFrom = new FormControl();
  seriesDateTo = new FormControl();
  seriesDaysIncluded: number[] = [];
  releasedInRange: number[] = [];
  weekDays = [1, 2, 3, 4, 5, 6, 7];

  withSignatura: boolean;
  seriesSignatura: string;

  dateFormats = ['dd.mm.yyyy', 'mm.yyyy', 'yyyy'];
  dateFormat: string = 'dd.mm.yyyy';

  filteredModels: string[];

  maxDate: Date = new Date();

  objectPosition: string = 'end';


  constructor(
    @Inject(MAT_DATE_FORMATS) private dateFormatConfig: MultiDateFormat,
    public adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: NewObjectData) { }

  ngOnInit() {
    if (this.data.isJob) {
      this.changeProfile(this.data.profile);
    } else {
      this.filteredModels = this.data.models.filter(f => f.indexOf('page') < 0);
    }

    this.maxDate.setFullYear(this.maxDate.getFullYear() + 2);
  }

  changeProfile(e: WorkFlowProfile) {
    this.filteredModels = e.model.map(m => m.name);
    this.data.model = this.filteredModels[0];
  }


  validate(): boolean {
    return ((this.isMultiple && this.frequency.value && this.seriesPartNumberFrom.value !== null) || !this.isMultiple) && (!this.data.customPid || Uuid.validate(this.data.pid));
  }

  changeWithPartNumber() {
    if (this.withPartNumber) {
      this.seriesPartNumberFrom.enable();
      this.seriesPartNumberFrom.markAsTouched();
    } else {
      this.seriesPartNumberFrom.disable();
    }
  }

  markRequired() {
    this.frequency.markAsTouched();
    this.changeWithPartNumber();
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    if (this.dateFormat === 'mm.yyyy') {
      const ctrlValue = control.value ? control.value : new Date();
      ctrlValue.setMonth(normalizedMonthAndYear.month());
      ctrlValue.setFullYear(normalizedMonthAndYear.year());
      control.setValue(ctrlValue);
      // this.seriesDateTo = ctrlValue;
      datepicker.close();
    }
  }

  setYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, control: FormControl) {
    if (this.dateFormat === 'yyyy') {
      const ctrlValue = control.value ? control.value : new Date();
      ctrlValue.setMonth(normalizedMonthAndYear.month());
      ctrlValue.setFullYear(normalizedMonthAndYear.year());
      control.setValue(ctrlValue);
      // this.seriesDateTo = ctrlValue;
      datepicker.close();
    }
  }

  changeFormat(e: string) {
    this.dateFormatConfig.value = e;
    this.seriesDateFrom = new FormControl(this.seriesDateFrom.value);
  }

  onCreateJob(xml?: string) {
    let data = `profileName=${this.data.profile.name}&model=${this.data.model}`;
    if (this.data.parentId && this.data.parentId > -1) {
      data = `${data}&parentId=${this.data.parentId}`;
    }

    data = `${data}&metadata=${encodeURIComponent(xml)}`;
    this.api.createWorkflow(data).subscribe((response: any) => {

      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        // this.state = 'error';
        return;
      }
      const data: any = response['response']['data'][0];
      data.isWorkFlow = true;
      this.dialogRef.close({ isWorkFlow: true, data });
    });
  }

  onCreate() {
    if (this.data.isJob) {
      this.onCreateJob('null');
      return;
    }
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

      if (this.seriesSignatura) {
        data += '&seriesTotalNumbers=' + this.seriesTotalNumbers;
      }
      data += '&seriesPartNumberFrom=' + this.seriesPartNumberFrom.value;
      data += '&seriesDateFrom=' + this.datePipe.transform(this.seriesDateFrom.value, 'yyyy-MM-dd');
      data += '&seriesDateTo=' + this.datePipe.transform(this.seriesDateTo.value, 'yyyy-MM-dd');
      this.seriesDaysIncluded.forEach(d => {
        data += '&seriesDaysIncluded=' + d;
      });

      this.releasedInRange.forEach(d => {
        data += '&seriesDaysInRange=' + d;
      });

      if (this.seriesSignatura) {
        data += '&seriesSignatura=' + this.seriesSignatura;
      }

      data += '&seriesFrequency=' + this.frequency.value;
      data += '&seriesDateFormat=' + this.dateFormat;
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
      const pid = response['response']['data'][0]['pid'];
      this.dialogRef.close({
        pid: pid,
        data: response['response']['data'][0],
        isMultiple: this.isMultiple,
        objectPosition: this.objectPosition
      });

    });
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, {
      data: { type: 'full', create: true },
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {

        if (this.data.isJob) {
          this.onCreateJob(result['mods']);
          return;
        }

        this.state = 'saving';
        const customPid = this.data.customPid ? this.data.pid : null;

        let data = `model=${this.data.model}&catalogId=${result['catalogId']}&createObject=false`;
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
          const pid = response['response']['data'][0]['pid'];
          this.state = 'success';
          this.dialogRef.close({
            pid: pid,
            objectPosition: this.objectPosition,
            data: response['response']['data'][0]
          });
        });
      }
    });
  }

  frecuencyChanged(e: string) {
    if (e === 'd') {
      this.seriesDaysIncluded = [1, 2, 3, 4, 5, 6, 7]
    }
  }

}

export interface NewObjectData {
  profiles?: WorkFlowProfile[];
  profile?: WorkFlowProfile;
  parentId?: number;
  model: string;
  models: string[];
  customPid: boolean;
  parentPid?: string;
  pid?: string;
  cislood?: string;
  fromNavbar: boolean;
  isJob?: boolean;
}
