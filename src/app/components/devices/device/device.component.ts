import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/model/device.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  device: Device;
  state = 'none';

  constructor(private api: ApiService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = 'loading';
      this.api.getDevice(params['id']).subscribe((device: Device) => {
        this.device = device;
        this.state = 'success';
      });
    });
  }

}