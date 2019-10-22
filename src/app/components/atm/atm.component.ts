import { Atm } from './../../model/atm.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Device } from 'src/app/model/device.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.scss']
})
export class AtmComponent implements OnInit {

  state = 'none';
  atm: Atm;
  devices: Device[];

  deviceId: string;

  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const rAtm = this.api.getAtm(id);
      const rDevice = this.api.getDevices();
     forkJoin(rAtm, rDevice).subscribe(([atm, devices]: [Atm, Device[]]) => {
        this.atm = atm;
        this.devices = devices;
        this.deviceId = this.atm.device;
        this.state = 'success';
      }, () => {
        this.state = 'failure';
      });
    });
  }

  deviceChanged(): boolean {
    return this.deviceId !== this.atm.device;
  }


  updateDevice() {
    this.state = 'saving';
    this.api.editAtmDevice(this.atm, this.deviceId).subscribe((atm: Atm) => {
      console.log('new atm', atm);
      this.state = 'success';
      this.atm = atm;
    });
  }
}
