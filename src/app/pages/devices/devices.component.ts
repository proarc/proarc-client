import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Device } from 'src/app/model/device.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  state = 'none';
  devices: Device[];

  displayedColumns: string[] = ['model', 'label', 'action'];

  public selectedColumns = [
    { field: 'model', selected: true, width: 100 },
    { field: 'label', selected: true, width: 100 },
    { field: 'action', selected: true, width: 100 }
  ];

  constructor(
    private api: ApiService,
    public properties: LocalStorageService) { }

  ngOnInit() {
    this.state = 'loading';
    this.api.getDevices().subscribe((devices: Device[]) => {
      this.devices = devices;
      this.state = 'success';
      console.log('devices', devices);
    });
    this.initSelectedColumns();
  }

   // resizable columns
   setColumns() {
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumns() {
    const prop = this.properties.getStringProperty('devicesColumns');
    if (prop) {
      Object.assign(this.selectedColumns, JSON.parse(prop));
    }
    this.setColumns();
  }

  getColumnWidth(field: string) {
    const el = this.selectedColumns.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizes(e: any, field?: string) {
    const el = this.selectedColumns.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.properties.setStringProperty('devicesColumns', JSON.stringify(this.selectedColumns));
  }
  // end

}
