import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/model/device.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
import { AudioDevice } from 'src/app/model/audioDevice.model';

@Component({
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
