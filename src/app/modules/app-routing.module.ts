import { DocumentComponent } from './../documents/document/document.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DevicesComponent } from '../components/devices/devices.component';
import { DeviceComponent } from '../components/devices/device/device.component';

const routes: Routes = [
  { path: 'documents/:id', component: DocumentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'devices/:id', component: DeviceComponent },
  { path: 'devices', component: DevicesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
