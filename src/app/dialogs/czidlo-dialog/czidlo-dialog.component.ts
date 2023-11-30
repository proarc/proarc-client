import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { UrnnbnDialogComponent } from '../urnnbn-dialog/urnnbn-dialog.component';
import { Registrar } from 'src/app/model/registrar.model';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { CodebookService } from 'src/app/services/codebook.service';

@Component({
  selector: 'app-czidlo-dialog',
  templateUrl: './czidlo-dialog.component.html',
  styleUrls: ['./czidlo-dialog.component.scss']
})
export class CzidloDialogComponent implements OnInit {

  state = 'none';
  message = '';
  log = '';
  selectedRegistrar: Registrar;
  registrars: Registrar[] = [];
  selectedIdentifier: string;
  identifiers: {code: string, name: string}[] = [];
  selectedOperation: string;
  operations = ['update', 'delete'];
  errors: any[];

  tableColumns = ['label', 'model', 'statusType', 'warning', 'pid', 'urnnbn', 'message'];
  responseData: any;
  selectedRow: string;
  selectedRowWarning: boolean;

  showSuccessor = false;
  showNewRegistration = false;
  showUpdateIdentifier = false;

  constructor(
    public dialogRef: MatDialogRef<CzidloDialogComponent>,
    public codebook: CodebookService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    private translator: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: {pid: string, model: string}) { }

  ngOnInit(): void {

    this.state = 'saving';
    this.api.getRegistrars().subscribe((response: any) => {
      //.pipe(map(response => Registrar.fromJsonArray(response['response']['data'])));
      if (response['response'].errors) {
        console.log('onRegister error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.czidlo.alert.error'));
        return;
      }
      const registrars: Registrar[] = Registrar.fromJsonArray(response['response']['data']);
      this.registrars = registrars;
      this.selectedRegistrar = this.registrars[0];
      this.state = 'none';
    });

    this.identifiers =  this.codebook.getIdentifiers(this.data.model)
    .filter(id => id.code !== 'ccnb' && id.code !== 'urnnbn' && id.code !== 'isbn' );
    //console.log()
  }

  invalidateLocal() {
    this.api.invalidateLocal(this.data.pid).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('invalidateLocal error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.czidlo.alert.error'));
        return;
      }
      if (response.response.data.length === 0) {
        this.message = String(this.translator.instant('dialog.czidlo.alert.success'));
        this.state = 'success';
        return;
      }

      this.responseData = response.response.data;
      this.state = 'success';
      this.dialogRef.updateSize('1200px');
    });
  }

  onNewRegistration() {
    this.showNewRegistration = true;
  }

  newRegistration() {

    if (!this.selectedRegistrar) {
      return;
    }
    this.state = 'saving';
    this.errors = [];
    this.api.newRegistration(this.data.pid, this.selectedRegistrar.id).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('invalidateLocal error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.czidlo.alert.error'));
        return;
      }
      if (response.response.data.length === 0) {
        this.message = String(this.translator.instant('dialog.czidlo.alert.success'));
        this.state = 'success';
        return;
      }

      this.responseData = response.response.data;
      this.state = 'success';
      this.dialogRef.updateSize('1200px');
    });
  }

  onUpdateIdentifier() {
    this.showUpdateIdentifier = true;

  }

  updateIdentifier() {

    if (!this.selectedRegistrar || !this.selectedIdentifier || !this.selectedOperation) {
      return;
    }
    this.state = 'saving';
    this.errors = [];
    this.api.updateIdentifier(this.data.pid, this.selectedRegistrar.id, this.selectedIdentifier, this.selectedOperation).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('invalidateLocal error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.czidlo.alert.error'));
        return;
      }
      if (response.response.data.length === 0) {
        this.message = String(this.translator.instant('dialog.czidlo.alert.success'));
        this.state = 'success';
        return;
      }

      this.responseData = response.response.data;
      this.state = 'success';
      this.dialogRef.updateSize('1200px');
    });
  }

  onSuccessor() {
    this.showSuccessor = true;
  }

  successor() {
    if (!this.selectedRegistrar) {
      return;
    }
    this.state = 'saving';
    this.errors = [];
    this.api.successor(this.selectedRegistrar.id, this.data.pid).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('onRegister error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.czidlo.alert.error'));
        return;
      }
      if (response.response.data.length === 0) {

        this.message = String(this.translator.instant('dialog.czidlo.alert.success'));
        this.state = 'success';
        return;
      }

      this.responseData = response.response.data;
      this.state = 'success';
      this.dialogRef.updateSize('1200px');
    });
  }

  selectRow(row: any) {
    this.message = row.message;
    this.selectedRow = row.pid;
    this.selectedRowWarning = row.warning;
  }

  formDisabled(): boolean {
    return this.state != 'none' || !this.selectedRegistrar; 
  }


  showErrorDetail(error: any) {
    const data = {
      title: '',
      content: error
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

}
