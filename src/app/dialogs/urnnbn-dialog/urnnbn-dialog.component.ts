
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { Registrar } from 'src/app/model/registrar.model';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-urnnbn-dialog',
  templateUrl: './urnnbn-dialog.component.html',
  styleUrls: ['./urnnbn-dialog.component.scss']
})
export class UrnnbnDialogComponent implements OnInit {

  state = 'none';
  message = '';
  log = '';
  selectedRegistrar: Registrar;
  registrars: Registrar[] = [];
  errors: any[];

  tableColumns = ['label', 'model', 'statusType', 'warning', 'pid', 'urnnbn', 'message'];
  responseData: any;
  selectedRow: string;
  selectedRowWarning: boolean;

  constructor(
    public dialogRef: MatDialogRef<UrnnbnDialogComponent>,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.state = 'saving';
    this.api.getRegistrars().subscribe((response: any) => {
      //.pipe(map(response => Registrar.fromJsonArray(response['response']['data'])));
      if (response['response'].errors) {
        console.log('onRegister error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = 'Při registraci URN:NBN se vyskytla chyba';
        return;
      }
      const registrars: Registrar[] = Registrar.fromJsonArray(response['response']['data']);
      this.registrars = registrars;
      this.selectedRegistrar = this.registrars[0];
      this.state = 'none';
    });
  }

  onRegister() {
    if (!this.selectedRegistrar) {
      return;
    }
    this.state = 'saving';
    const pid = this.data;
    this.errors = [];
    this.api.registerUrnnbn(this.selectedRegistrar.id, pid).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('onRegister error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = 'Při registraci URN:NBN se vyskytla chyba';
        return;
      }
      if (response.response.data.length === 0) {
        this.message = `Žádné položky k zobrazení`;
        this.state = 'success';
        return;
      }

      this.responseData = response.response.data;
      this.state = 'success';
      // const data = response['response']['data'][0];
      // if (data['statusType'] == "URNNBN_EXISTS") {
      //   this.state = 'error';
      //   this.message = `Dokument má již přiděleno URN:NBN ${data['urnnbn']}`;
      // } else if (data['statusType'] == "NO_PAGE_FOUND") {
      //   this.state = 'error';
      //   this.message = 'Dokument neobsahuje žádné strany';
      // } else if (!data['statusType'] && data['urnnbn']) {
      //   this.state = 'success';
      //   this.message = `Dokumentu bylo úspěšně přiděleno URN:NBN ${data['urnnbn']}`;
      // } else {
      //   this.state = 'error';
      //   this.message = 'Při registraci URN:NBN se vyskytla chyba';
      //   if (data['message']) {
      //     this.log = data['message'];
      //   }
      // }
      // console.log('data', data);
      this.dialogRef.updateSize('1200px');
    },
    (error) => {
      console.log('onRegister error', error);
      this.state = 'error';
      this.message = 'Při registraci URN:NBN se vyskytla chyba';
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
