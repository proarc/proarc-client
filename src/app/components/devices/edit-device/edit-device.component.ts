import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/model/device.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {

  state = 'loading';
  mode = 'none';
  device: Device;
  deviceName: string;

  captureDevices = ['transmission scanner', 'reflection print scanner', 'digital still camera', 'still from video'];
  scannerManufacturers = ['Zeutschel', 'Treventus', '4DigitalBooks'];
  resolutionUnits = ['cm', 'in.', 'no absolute unit'];
  sensors = ['MonochromeLinear', 'ColorTriLinear', 'ColorSequentialLinear', 'MonochromeArea', 'OneChipColorArea',
            'TwoChipColorArea', 'ThreeChipColorArea', 'ColorSequentialArea'];

  models = [ 'proarc:audiodevice', 'proarc:device' ];

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private ui: UIService,
              private router: Router) { }

  ngOnInit() {
    this.state = 'loading';
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.api.getDevice(params['id']).subscribe((device: Device) => {
          this.device = device;
          this.deviceName = device.label;
          this.init('edit');
        });
      } else {
        this.device = new Device(this.models[0]);
        this.init('new');
      }
    });
  }

  private init(mode: string) {
    this.mode = mode;
    this.state = 'success';
  }

  onSubmit() {
    this.state = 'saving';
    if (this.mode === 'new') {
      this.api.createDevice(this.device.model).subscribe((device: Device) => {
        this.device.id = device.id;
        this.api.editDevice(this.device).subscribe(() => {
          this.ui.showInfoSnackBar('Zařízení bylo vytvořeno');
          this.router.navigate(['/devices', device.id]);
        });
      });
    } else if (this.mode === 'edit') {
      this.api.editDevice(this.device).subscribe((device: Device) => {
        this.ui.showInfoSnackBar('Zařízení bylo upraveno');
        this.router.navigate(['/devices', this.device.id]);
      });
    }
  }


}
