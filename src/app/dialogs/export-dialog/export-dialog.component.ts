
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Configuration } from '../../shared/configuration';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import {MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, MatDialogModule, MatTableModule, 
    CdkDrag, CdkDragHandle, 
    MatProgressBarModule, MatSelectModule, MatRadioModule, MatIconModule, 
    MatButtonModule, MatTooltipModule, MatCardModule, FormsModule, 
    MatFormFieldModule, MatCheckboxModule, MatSlideToggleModule],
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  state = 'none';
  types: string[];


  selectedType: string;
  policyPublic: boolean;
  cesnetLtpToken: string;
  //isBagit: boolean = false;
  target: string;
  errors: any[];
  canContinue = false;

  extendedType: string;
  noTifMessage: string;
  addInfoMessage: string;
  

  public importInstance: { krameriusInstanceId: string, krameriusInstanceName: string, krameriusInstanceLicenses?: 
    {krameriusInstanceLicenseName: string, krameriusInstanceLicenseDescription: string}[] };
  public instances: { krameriusInstanceId: string, krameriusInstanceName: string }[];
  public licenseName: string;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private api: ApiService,
    private config: Configuration,
    private ui: UIService,
    private dialog: MatDialog,
    public settings: UserSettings,
    @Inject(MAT_DIALOG_DATA) public data: {pid: string, model: string}[]) { }

  ngOnInit() {
    if (this.data[0].model.indexOf('oldprint') > -1) {
      this.types = this.config.exports.filter((t: string) => t !== 'archive')
    } else {
      this.types = this.config.exports.filter((t: string) => t !== 'archive_stt')
    }

    this.api.getKrameriusInstances().subscribe((resp: any) => {
      this.instances = resp.response.data;
      if (this.instances.length > 0) {
        this.importInstance = this.instances[0];
      }
    });

    this.api.getValidExports(this.data[0].model).subscribe((resp: any) => {
      this.types = this.config.exports.filter((t: string) => resp.response.data[0].includes(t));
    });

    this.selectedType = this.types[0];
    this.policyPublic = true;
  }


  onExport(ignoreMissingUrnNbn: boolean) {
    this.state = 'saving';
    const pids = this.data.map(p => p.pid);
    const policy = this.policyPublic ? 'public' : 'private';
    this.errors = [];
    this.target = null;
    this.api.export(this.selectedType, pids, policy, 
      ignoreMissingUrnNbn, this.importInstance ? this.importInstance.krameriusInstanceId : '', this.cesnetLtpToken, this.licenseName,
      this.extendedType, this.noTifMessage, this.addInfoMessage).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      const data =  response['response']['data'];
      for (const d of data) {
        if(d.ignoreMissingUrnNbn && this.data[0].model.indexOf('oldprint') > -1) {
          this.canContinue = true;
        }
        if (d.errors && d.errors.length > 0) {
          this.errors.push(d.errors[0]);
          if(d.errors[0].ignoreMissingUrnNbn && this.data[0].model.indexOf('oldprint') > -1) {
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
    this.dialog.open(LogDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-log', 'app-form-view-' + this.settings.appearance]
    });
  }

}
