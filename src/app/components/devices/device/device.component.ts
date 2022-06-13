import { UIService } from 'src/app/services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/model/device.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  device: Device;
  state = 'none';
  private id: string;

  constructor(private api: ApiService,
              private dialog: MatDialog,
              private router: Router,
              private translator: TranslateService,
              private ui: UIService,
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

