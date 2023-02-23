import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Device } from 'src/app/model/device.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  state = 'none';
  devices: Device[];

  displayedColumns: string[] = ['model', 'label'];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.state = 'loading';
    this.api.getDevices().subscribe((devices: Device[]) => {
      this.devices = devices;
      this.state = 'success';
      console.log('devices', devices);
    });
  }

}
