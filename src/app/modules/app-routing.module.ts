import { ViewerComponent } from './../components/viewer/viewer.component';
import { SearchComponent } from './../components/search/search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DevicesComponent } from '../components/devices/devices.component';
import { DeviceComponent } from '../components/devices/device/device.component';
import { EditDeviceComponent } from '../components/devices/edit-device/edit-device.component';
import { EditAudioDeviceComponent } from '../components/devices/edit-audio-device/edit-audio-device.component';
import { EditorComponent } from '../components/editor/editor.component';
import { ImportComponent } from '../components/import/import.component';
import { HistoryComponent } from '../components/import/history/history.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { ConfirmLeaveEditorGuard } from '../confirm-leave-editor.guard';
import { AdminComponent } from '../pages/admin/admin.component';
import { WorkflowComponent } from '../components/workflow/workflow.component';
import { RepositoryComponent } from '../pages/repository/repository.component';
import { LayoutAdminComponent } from '../pages/layout-admin/layout-admin.component';
import { BatchesComponent } from '../pages/batches/batches.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
      { path: 'login', component: LoginComponent },
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: 'document/:pid', component: EditorComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
      { path: 'repository/:pid', component: RepositoryComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
      { path: 'settings', component: SettingsComponent },
      { path: 'devices', component: DevicesComponent },
      { path: 'devices/new', component: EditDeviceComponent },
      { path: 'devices/:id', component: DeviceComponent },
      { path: 'devices/:id/edit', component: EditDeviceComponent },
      { path: 'devices/:device_id/audio/new', component: EditAudioDeviceComponent },
      { path: 'devices/:device_id/audio/:id/edit', component: EditAudioDeviceComponent },
      { path: 'search', component: SearchComponent },
      { path: 'viewer', component: ViewerComponent },
      { path: 'import', component: ImportComponent },
      { path: 'import/history', component: HistoryComponent },
      // { path: 'import/edit/:batch_id', component: EditorComponent, canDeactivate:[ConfirmLeaveEditorGuard] },
      { path: 'import/edit/:batch_id', component: BatchesComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
      { path: 'admin', component: AdminComponent },
      { path: 'layout', component: LayoutAdminComponent },
      { path: 'workflow', component: WorkflowComponent },
      { path: '', redirectTo: '/search', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
