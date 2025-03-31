import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChange, Output, EventEmitter, effect, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
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

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
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
    public auth: AuthService) {
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
      if (this.devices) {
        this.state = 'success';
      } else {
        this.api.getDevices().subscribe((devices: Device[]) => {
          this.devices = devices;
          this.api.getUsers().subscribe((users: User[]) => {
            this.users = users;
            this.state = 'success';
          });
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

    this.state = 'saving';
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

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

}
