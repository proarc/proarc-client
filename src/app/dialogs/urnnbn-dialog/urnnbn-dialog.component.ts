
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { Registrar } from 'src/app/model/registrar.model';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-urnnbn-dialog',
  templateUrl: './urnnbn-dialog.component.html',
  styleUrls: ['./urnnbn-dialog.component.scss']
})
export class UrnbnbDialogComponent implements OnInit {

  state = 'none';
  message = '';
  log = '';
  selectedRegistrar: Registrar;
  registrars: Registrar[] = [];
  errors: any[];

  constructor(
    public dialogRef: MatDialogRef<UrnbnbDialogComponent>,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.state = 'saving';
    this.api.getRegistrars().subscribe((registrars: Registrar[]) => {
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
      if (response.errors) {
        console.log('onRegister error', response.errors);
        this.ui.showErrorSnackBarFromObject(response.errors);
        this.state = 'error';
        this.message = 'Při registraci URN:NBN se vyskytla chyba';
        return;
      }
      const data = response['response']['data'][0];
      if (data['statusType'] == "URNNBN_EXISTS") {
        this.state = 'error';
        this.message = `Dokument má již přiděleno URN:NBN ${data['urnnbn']}`;
      } else if (data['statusType'] == "NO_PAGE_FOUND") {
        this.state = 'error';
        this.message = 'Dokumant neobsahuje žádné strany';
      } else if (!data['statusType'] && data['urnnbn']) {
        this.state = 'success';
        this.message = `Dokumentu bylo úspěšně přiděleno URN:NBN ${data['urnnbn']}`;
      } else {
        this.state = 'error';
        this.message = 'Při registraci URN:NBN se vyskytla chyba';
        if (data['message']) {
          this.log = data['message'];
        }
      }
      // console.log('data', data);
    },
    (error) => {
      console.log('onRegister error', error);
      this.state = 'error';
      this.message = 'Při registraci URN:NBN se vyskytla chyba';
    });
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
