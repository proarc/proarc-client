import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Device } from 'src/app/model/device.model';
import { Atm } from 'src/app/model/atm.model';
// import { EditorService } from 'src/app/services/editor.service';
import { ConfigService } from 'src/app/services/config.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';

@Component({
  selector: 'app-editor-atm',
  templateUrl: './editor-atm.component.html',
  styleUrls: ['./editor-atm.component.scss']
})
export class EditorAtmComponent implements OnInit {

   
  @Input('editorType') editorType: string;
  @Output() onChangeEditorType = new EventEmitter<string>();

  @Input('pid') pid: string;
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
    private config: ConfigService, 
    private ui: UIService,
    public auth: AuthService) {
  }

  ngOnInit() {
    this.organizations = this.config.organizations;
    this.donators = this.config.donators;
    // this.layout.selectionChanged().subscribe(() => {
    //   this.reload();
    // });
    // this.reload();
  }

  ngOnChanges(c: SimpleChange) {
    if (!this.layout.lastSelectedItem) {
      //this.visible = false;
      return;
    }
    if (this.pid) {
      this.reload();
    }
  }

  private reload() {
    if (!this.layout.lastSelectedItem) {
      return;
    }
    this.state = 'loading';
    this.api.getAtm(this.layout.lastSelectedItem.pid, this.layout.getBatchId()).subscribe((atm: Atm) => {
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


  onRevert() {
    this.atm.restore();
  }

  onSave() {
    if (!this.atm.hasChanged()) {
      return;
    }

    this.state = 'saving';
    this.api.editAtm(this.atm, this.layout.getBatchId()).subscribe((response: any) => {
        if (response.response.errors) {
            this.ui.showErrorDialogFromObject(response.response.errors);
            this.state = 'error';
            return;
        }
        const newAtm: Atm = Atm.fromJson(response['response']['data'][0]);
        this.atm = newAtm;
        this.state = 'success';
    });
  }

  changeEditorType(t: string) {
    this.onChangeEditorType.emit(t);
  }

}
