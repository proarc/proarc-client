
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
import { AudioDevice } from '../../../model/audioDevice.model';
import { Device } from '../../../model/device.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';

@Component({
  imports: [TranslateModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatTableModule],
  selector: 'app-edit-audio-device',
  templateUrl: './edit-audio-device.component.html',
  styleUrls: ['./edit-audio-device.component.scss']
})
export class EditAudioDeviceComponent implements OnInit {

  state = 'loading';
  mode = 'none';
  device: Device;
  audioDevice: AudioDevice;
  id: number;

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private ui: UIService,
              private router: Router) { }

  ngOnInit() {
    this.state = 'loading';
    this.route.params.subscribe(params => {
      const deviceId = params['device_id'];
      this.id = params['id'];
      this.api.getDevice(deviceId).subscribe((device: Device) => {
        this.device = device;
        if (this.id) {
          this.audioDevice = device.audioDevices[this.id - 1];
          this.mode = 'edit';
        } else {
          this.audioDevice = new AudioDevice();
          this.device.audioDevices.push(this.audioDevice);
          this.mode = 'new';
        }
        this.state = 'success';
      });
    });
  }

  onSubmit() {
    this.state = 'saving';
    this.api.editDevice(this.device).subscribe((device: Device) => {
      if (this.mode === 'edit') {
        this.ui.showInfoSnackBar('Audilo linka bylo upravena');
      } else if (this.mode === 'new') {
        this.ui.showInfoSnackBar('Audilo linka bylo vytvořena');
      }
      this.router.navigate(['/devices', this.device.id]);
    });
  }

}
