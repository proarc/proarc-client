import { ViewerComponent } from './../components/viewer/viewer.component';
import { SearchComponent } from '../pages/search/search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { DevicesComponent } from '../pages/devices/devices.component';
import { DeviceComponent } from '../pages/devices/device/device.component';
import { EditDeviceComponent } from '../pages/devices/edit-device/edit-device.component';
import { EditAudioDeviceComponent } from '../pages/devices/edit-audio-device/edit-audio-device.component';
import { ImportComponent } from '../components/import/import.component';
import { HistoryComponent } from '../components/import/history/history.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { ConfirmLeaveEditorGuard } from '../confirm-leave-editor.guard';
import { AdminComponent } from '../pages/admin/admin.component';
import { WorkflowComponent } from '../pages/workflow/workflow.component';
import { RepositoryComponent } from '../pages/repository/repository.component';
import { BatchesComponent } from '../pages/batches/batches.component';
import { AuthGuard } from '../auth.guard';
import { KrameriusComponent } from '../pages/kramerius/kramerius.component';
import { EditUserComponent } from '../pages/admin/edit-user/edit-user.component';
import { CreateUserComponent } from '../pages/admin/create-user/create-user.component';
import { AdminGuard } from '../admin.guard';

const routes: Routes = [
      { path: 'login', component: LoginComponent },
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: 'repository/:pid', component: RepositoryComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
      { path: 'kramerius/:pid', component: KrameriusComponent },
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
      //{ path: 'admin', component: AdminComponent },
      { path: 'admin/:id/edit', component: EditUserComponent },
      { path: 'admin/create', component: CreateUserComponent },
      { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
      { path: 'workflow', loadChildren: () => import('../pages/workflow/workflow.module').then(m => m.WorkflowModule) },
      { path: '', redirectTo: '/search', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
