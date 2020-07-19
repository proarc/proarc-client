import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Device } from 'src/app/model/device.model';
import { Atm } from 'src/app/model/atm.model';
import { EditorService } from 'src/app/services/editor.service';
import { ConfigService } from 'src/app/services/config.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-editor-atm',
  templateUrl: './editor-atm.component.html',
  styleUrls: ['./editor-atm.component.scss']
})
export class EditorAtmComponent implements OnInit {

  state = 'none';
  atm: Atm;
  devices: Device[];
  organizations: string[];
  users: User[];

  statuses = [
    'new',
    'assign',
    'connected',
    'processing',
    'described',
    'exported'
  ];

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(private editor: EditorService, private api: ApiService, private config: ConfigService, public auth: AuthService) {
  }

  ngOnInit() {
    this.organizations = this.config.organizations;
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
   this.api.getAtm(pid).subscribe((atm: Atm) => {
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
    this.editor.saveAtm(this.atm, (atm: Atm) => {
      this.atm = atm;
    });
  }

}
