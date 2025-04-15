import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Device } from '../../model/device.model';
import { ApiService } from '../../services/api.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { Router, RouterModule } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
  imports: [CommonModule, TranslateModule, RouterModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, UserTableComponent],
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  state = 'none';
  devices: Device[];
  actions: {icon: string, action: (e: any) => void, tooltip: string}[] = [];

  constructor(
    private router: Router,
    private api: ApiService,
    public settings: UserSettings,
    public settingsService: UserSettingsService
  ) { }

  ngOnInit() {
    this.state = 'loading';
    this.actions.push({
      icon: 'edit_note',
      tooltip: 'button.edit',
      action: (e: any) => {
        this.router.navigate(['/devices', e.id])
      }
    });
    this.api.getDevices().subscribe((devices: Device[]) => {
      this.devices = devices;
      this.state = 'success'
    });
  }

  sortBy(e: Sort) {
    
  }

  selectRow(e: {item: Device, event?: MouseEvent, idx?: number}) {
    
  }

  openItem(device: Device) {
    
  }

}
