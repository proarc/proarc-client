
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  state = 'none';
  types =  this.config.exports;

  selectedType: string;
  policyPublic: boolean;
  target: string;
  errors: any[];

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private api: ApiService,
    private config: ConfigService,
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.selectedType = this.types[0];
    this.policyPublic = true;
  }

  onExport() {
    this.state = 'saving';
    const pid = this.data;
    const policy = this.policyPublic ? 'public' : 'private';
    this.errors = [];
    this.target = null;
    this.api.export(this.selectedType, pid, policy).subscribe((data: any) => {
      for (const d of data) {
        if (d.errors) {
          this.errors.push(d.errors[0]);
        } else if (d.target) {
          this.target = d.target;
        } 
      }
      if (this.errors.length === 0 && this.target) {
        this.state = 'done';
      } else {
        this.state = 'error';
      }
    },
    (error) => {
      this.state = 'error';
      this.errors.push({
        message: error.message,
        log: error.error
      });
    });
  }

  formDisabled(): boolean {
    return this.state === 'saving' || this.state === 'done'; 
  }


  showErrorDetail(error: any) {
    const data = {
      title: error.message,
      content: error.log
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

}
