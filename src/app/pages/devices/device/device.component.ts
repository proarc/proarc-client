import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SimpleDialogData } from '../../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../../dialogs/simple-dialog/simple-dialog.component';
import { Device } from '../../../model/device.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { MatTableModule } from '@angular/material/table';
import {AuthService} from '../../../services/auth.service';

@Component({
  imports: [TranslateModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatTableModule],
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  device: Device;
  state = 'none';
  private id: string;

  displayedColumns: string[] = ['name', 'type', 'manufacturer', 'serialNumber', 'settings', 'identifierType', 'identifierValue', 'identifierRole', 'actions'];

  constructor(private api: ApiService,
              private dialog: MatDialog,
              private router: Router,
              private translator: TranslateService,
              private ui: UIService,
              public auth: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.reload();
    });
  }

  private reload() {
    this.state = 'loading';
    this.api.getDevice(this.id).subscribe((device: Device) => {
      this.device = device;
      this.state = 'success';
    });
  }

  removeDevice() {
    // this.translator.waitForTranslation().then(() => {
      const data: SimpleDialogData = {
        title: String(this.translator.instant('device.delete_dialog.title')),
        message: String(this.translator.instant('device.delete_dialog.message', { name: this.device.label })),
        alertClass: 'app-message',
        btn2: {
          label: String(this.translator.instant('common.no')),
          value: 'no',
          color: 'default'
        },
        btn1: {
          label: String(this.translator.instant('common.yes')),
          value: 'yes',
          color: 'warn'
        }
      };
      const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.state = 'loading';
          this.api.removeDevice(this.device.id).subscribe(() => {
            this.ui.showInfoSnackBar(String(this.translator.instant('device.delete_dialog.success')));
            this.router.navigate(['/devices']);
          });
        }
      });
    // });
  }

  removeAudioDevice(position: number) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('device.delete_audio_dialog.title')),
      message: String(this.translator.instant('device.delete_audio_dialog.message')),
      alertClass: 'app-message',
      btn2: {
        label: String(this.translator.instant('common.no')),
        value: 'no',
        color: 'default'
      },
      btn1: {
        label: String(this.translator.instant('common.yes')),
        value: 'yes',
        color: 'warn'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.state = 'loading';
        this.device.audioDevices.splice(position, 1);
        this.api.editDevice(this.device).subscribe((device: Device) => {
          this.ui.showInfoSnackBar(String(this.translator.instant('device.delete_dialog.success')));
          this.reload();
        });
      }
    });
  }

}

