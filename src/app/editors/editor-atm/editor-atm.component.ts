import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChange, Output, EventEmitter, effect, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { Atm } from '../../model/atm.model';
import { Device } from '../../model/device.model';
import { User } from '../../model/user.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';
import { Configuration } from '../../shared/configuration';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserSettings } from '../../shared/user-settings';
import { forkJoin } from 'rxjs';
import { Software, SOFTWARE_MODELS } from '../../model/software.model';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    EditorSwitcherComponent],
  selector: 'app-editor-atm',
  templateUrl: './editor-atm.component.html',
  styleUrls: ['./editor-atm.component.scss']
})
export class EditorAtmComponent implements OnInit {

  pid = input<string>();
  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();

  state = 'none';
  atm: Atm;
  devices: Device[];
  softwares: Software[];
  organizations: string[];
  users: User[];
  donators: string[];


  statuses = [
    'new',
    'assign',
    'connected',
    'processing',
    'described',
    'exported'
  ];

  constructor(
    public layout: LayoutService, 
    private api: ApiService, 
    private config: Configuration, 
    private ui: UIService,
    public auth: AuthService,
    public settings: UserSettings,
    private translator: TranslateService) {
      effect(() => {
        const pid = this.pid();
        if (!pid) {
          return;
        }
        this.reload(pid);
        
      });
  }

  ngOnInit() {
    this.organizations = this.config.organizations;
    this.donators = this.config.donators;
  }


  private reload(pid: string) {
    if (!this.layout.lastSelectedItem) {
      return;
    }
    this.state = 'loading';
    this.api.getAtm(pid, this.layout.batchId).subscribe((atm: Atm) => {
      this.atm = atm;
      if (this.devices && this.users && this.softwares) {
        this.state = 'success';
      } else {
        forkJoin({
          devices: this.api.getDevices(),
          users: this.api.getUsers(),
          softwares: this.api.getAllSoftware(SOFTWARE_MODELS.set)
        }).subscribe({
          next: ({ devices, users, softwares }) => {
            this.devices = devices;
            this.users = users;
            this.softwares = softwares;
            this.state = 'success';
          },
          error: () => this.state = 'failure'
        });
      }
    }, () => {
      this.state = 'failure';
    });
  }

  hasChanged() {
    const hasChanges = this.atm.hasChanged()
    if (hasChanges) {
      this.layout.setPanelEditing(this.panel());
    } else {
      if (this.panel().canEdit) {
        this.layout.clearPanelEditing();
      }
    }
    return hasChanges;
  }

  onRevert() {
    this.atm.restore();
    this.layout.clearPanelEditing();
  }

  onSave() {
    if (!this.atm.hasChanged()) {
      return;
    }

    this.state = 'loading';
    this.api.editAtm(this.atm, this.layout.batchId).subscribe((response: any) => {
        if (response.response.errors) {
            this.ui.showErrorDialogFromObject(response.response.errors);
            this.state = 'error';
            return;
        }
        const newAtm: Atm = Atm.fromJson(response['response']['data'][0]);
        this.atm = newAtm;
        this.state = 'success';
        this.layout.clearPanelEditing();
    });
  }

  regeneratePremis() {
    if (!this.atm || this.atm.hasChanged() || this.state !== 'success') {
      return;
    }
    this.state = 'loading';
    this.api.regeneratePremis([this.atm.pid], this.layout.batchId).subscribe({
      next: response => {
        this.state = 'success';
        if (response.response.errors || response.response.status < 0) {
          this.ui.showErrorDialogFromObject(response.response.errors || response.response);
          return;
        }
        this.ui.showInfoSnackBar(this.translator.instant('editor.atm.premisRegenerated'));
      },
      error: () => {
        this.state = 'success';
        this.ui.showErrorSnackBar(this.translator.instant('editor.atm.premisRegenerationFailed'));
      }
    });
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

}
