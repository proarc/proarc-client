import { ViewerComponent } from './../components/viewer/viewer.component';
import { SearchComponent } from './../components/search/search.component';
import { DocumentComponent } from './../documents/document/document.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DevicesComponent } from '../components/devices/devices.component';
import { DeviceComponent } from '../components/devices/device/device.component';
import { EditDeviceComponent } from '../components/devices/edit-device/edit-device.component';
import { CatalogComponent } from '../components/catalog/catalog.component';
import { EditAudioDeviceComponent } from '../components/devices/edit-audio-device/edit-audio-device.component';
import { EditorComponent } from '../components/editor/editor.component';
import { ImportComponent } from '../components/import/import.component';
import { HistoryComponent } from '../components/import/history/history.component';

const routes: Routes = [

  { path: 'documents/:id', component: DocumentComponent },

  { path: 'document/:pid', component: EditorComponent },

  { path: 'login', component: LoginComponent },
  { path: 'devices', component: DevicesComponent },
  { path: 'devices/new', component: EditDeviceComponent },
  { path: 'devices/:id', component: DeviceComponent },
  { path: 'devices/:id/edit', component: EditDeviceComponent },
  { path: 'devices/:device_id/audio/new', component: EditAudioDeviceComponent },
  { path: 'devices/:device_id/audio/:id/edit', component: EditAudioDeviceComponent },
  { path: 'search', component: SearchComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'viewer', component: ViewerComponent },
  { path: 'import', component: ImportComponent },
  { path: 'import/history', component: HistoryComponent },

  { path: '', redirectTo: 'search', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
