import { UIService } from 'src/app/services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/model/device.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { MatDialog } from '@angular/material';

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
    const data: SimpleDialogData = {
      title: 'Odstranění zařízení',
      message: `Opravdu chcete odstranit zařízení ${this.device.label || ''}?`,
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.state = 'loading';
        this.api.removeDevice(this.device.id).subscribe(() => {
          this.ui.showInfoSnackBar('Zařízení bylo odstraněno');
          this.router.navigate(['/devices']);
        });
      }
    });
  }

  removeAudioDevice(position: number) {
    const data: SimpleDialogData = {
      title: 'Odstranění audio linky',
      message: 'Opravdu chcete audio linku odstranit?',
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      btn1: {
        label: 'Ano',
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
          this.ui.showInfoSnackBar('Audio linka byla odstraněna');
          this.reload();
        });
      }
    });
  }

}

