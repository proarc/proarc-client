
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Device } from '../../../model/device.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';

@Component({
  imports: [TranslateModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatTableModule],
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
