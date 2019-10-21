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

  constructor(private api: ApiService,
              private dialog: MatDialog,
              private router: Router,
              private ui: UIService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = 'loading';
      this.api.getDevice(params['id']).subscribe((device: Device) => {
        this.device = device;
        console.log('device', device);
        this.state = 'success';
      });
    });
  }


  removeDevice() {
    const data: SimpleDialogData = {
      title: 'Odstranění zařízení',
      message: `Opravdu chcete odstranit zařízení ${this.device.name || ''}?`,
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

}

