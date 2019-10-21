import { DocumentComponent } from './../documents/document/document.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DevicesComponent } from '../components/devices/devices.component';
import { DeviceComponent } from '../components/devices/device/device.component';
import { EditDeviceComponent } from '../components/devices/edit-device/edit-device.component';

const routes: Routes = [
  { path: 'documents/:id', component: DocumentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'devices', component: DevicesComponent },
  { path: 'devices/new', component: EditDeviceComponent },
  { path: 'devices/:id', component: DeviceComponent },
  { path: 'devices/:id/edit', component: EditDeviceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
