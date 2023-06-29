
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { UIService } from 'src/app/services/ui.service';

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
  cesnetLtpToken: string;
  //isBagit: boolean = false;
  target: string;
  errors: any[];
  canContinue = false;
  

  public importInstance: string;
  public instances: { krameriusInstanceId: string, krameriusInstanceName: string }[];

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private api: ApiService,
    private config: ConfigService,
    private ui: UIService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {pid: string, model: string}) { }

  ngOnInit() {
    if (this.data.model.indexOf('oldprint') > -1) {
      this.types = this.config.exports.filter((t: string) => t !== 'archive')
    } else {
      this.types = this.config.exports.filter((t: string) => t !== 'archive_stt')
    }

    this.api.getKrameriusInstances().subscribe((resp: any) => {
      this.instances = resp.response.data;
      this.importInstance = this.instances[0].krameriusInstanceId;
    });

    this.api.getValidExports(this.data.model).subscribe((resp: any) => {
      this.types = this.config.exports.filter((t: string) => resp.response.data[0].includes(t));
    });

    this.selectedType = this.types[0];
    this.policyPublic = true;
  }


  onExport(ignoreMissingUrnNbn: boolean) {
    this.state = 'saving';
    const pid = this.data.pid;
    const policy = this.policyPublic ? 'public' : 'private';
    this.errors = [];
    this.target = null;
    this.api.export(this.selectedType, pid, policy, ignoreMissingUrnNbn, this.importInstance, this.cesnetLtpToken).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      const data =  response['response']['data'];
      for (const d of data) {
        if(d.ignoreMissingUrnNbn && this.data.model.indexOf('oldprint') > -1) {
          this.canContinue = true;
        }
        if (d.errors && d.errors.length > 0) {
          this.errors.push(d.errors[0]);
          if(d.errors[0].ignoreMissingUrnNbn && this.data.model.indexOf('oldprint') > -1) {
            this.canContinue = true;
          }
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
      content: error.pid + (error.log ? (': ' + error.log) : '')
    }
    this.dialog.open(LogDialogComponent, { data: data });
  }

}
