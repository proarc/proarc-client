
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { Registrar } from 'src/app/model/registrar.model';

@Component({
  selector: 'app-urnnbn-dialog',
  templateUrl: './urnnbn-dialog.component.html',
  styleUrls: ['./urnnbn-dialog.component.scss']
})
export class UrnbnbDialogComponent implements OnInit {

  state = 'none';
  selectedRegistrar: Registrar;
  registrars: Registrar[] = [];
  errors: any[];

  constructor(
    public dialogRef: MatDialogRef<UrnbnbDialogComponent>,
    private api: ApiService,
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
    this.api.registerUrnnbn(this.selectedRegistrar.id, pid).subscribe((data: any) => {
      this.state = 'done';
    },
    (error) => {
      console.log('onRegister error', error);
      this.state = 'error';
    });
  }

  formDisabled(): boolean {
    return this.state === 'saving' || this.state === 'done' || !this.selectedRegistrar; 
  }


  showErrorDetail(error: any) {
    const data = {
      title: error.message,
      content: error.log
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

}
