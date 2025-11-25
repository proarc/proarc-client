import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Registrar } from '../../model/registrar.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatTableModule, MatProgressBarModule, MatSelectModule, MatRadioModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule,
    FormsModule, MatFormFieldModule, MatCheckboxModule, MatSlideToggleModule
  ],
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
  invalidateURNNBN: string;
  errors: any[];

  tableColumns = ['label', 'model', 'statusType', 'warning', 'pid', 'urnnbn', 'message'];
  responseData: any;
  selectedRow: string;
  selectedRowWarning: boolean;

  showSuccessor = false;
  showNewRegistration = false;
  showUpdateIdentifier = false;
  showInvalidateRemote = false;

  constructor(
    public dialogRef: MatDialogRef<CzidloDialogComponent>,
    public config: Configuration,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    private translator: TranslateService,
    public settings: UserSettings,
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

    this.identifiers =  this.config.getIdentifiers(this.data.model)
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

  onInvalidateRemote() {
    this.showInvalidateRemote = true;
  }

  invalidateRemote() {

    if (!this.selectedRegistrar || !this.invalidateURNNBN) {
      return;
    }
    this.state = 'saving';
    this.errors = [];
    this.api.invalidateRemote(this.selectedRegistrar.id, this.invalidateURNNBN).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('invalidateRemote error', response['response'].errors);
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
    this.dialog.open(LogDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-log', 'app-form-view-' + this.settings.appearance]
    });
  }

}
