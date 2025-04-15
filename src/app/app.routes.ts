import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './shared/auth.guard';
import { TotestComponent } from './pages/totest/totest.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SearchComponent } from './pages/search/search.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { ConfirmLeaveEditorGuard } from './shared/confirm-leave-editor.guard';
import { ProcessManagementComponent } from './pages/process-management/process-management.component';
import { ImportComponent } from './pages/import/import.component';
import { BatchesComponent } from './pages/batches/batches.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './shared/admin.guard';
import { EditUserComponent } from './pages/admin/edit-user/edit-user.component';
import { NewUserComponent } from './pages/admin/new-user/new-user.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { DeviceComponent } from './pages/devices/device/device.component';
import { EditDeviceComponent } from './pages/devices/edit-device/edit-device.component';
import { EditAudioDeviceComponent } from './pages/devices/edit-audio-device/edit-audio-device.component';
import { WorkFlowComponent } from './pages/workflow/workflow.component';
import { TaskComponent } from './pages/workflow/task/task.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, ,
    {
        path: '', canActivate: [AuthGuard], children: [
            { path: 'repository/:pid', component: RepositoryComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
            // { path: 'kramerius/:pid', component: KrameriusComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'devices', component: DevicesComponent },
            { path: 'devices/new', component: EditDeviceComponent },
            { path: 'devices/:id', component: DeviceComponent },
            { path: 'devices/:id/edit', component: EditDeviceComponent },
            { path: 'devices/:device_id/audio/new', component: EditAudioDeviceComponent },
            { path: 'devices/:device_id/audio/:id/edit', component: EditAudioDeviceComponent },
            { path: 'search', component: SearchComponent },
            // { path: 'viewer', component: ViewerComponent },
            { path: 'process-management', component: ProcessManagementComponent },
            { path: 'import', component: ImportComponent },
            { path: 'import/edit/:batch_id', component: BatchesComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
            { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
            { path: 'admin/:id/edit-user', component: EditUserComponent },
            { path: 'admin/new-user', component: NewUserComponent },
            { path: 'workflow', 
                children: [
                    { path: '', component: WorkFlowComponent },
                      { path: 'jobs', component: WorkFlowComponent },
                      { path: 'jobs/:id', component: WorkFlowComponent },
                      { path: 'tasks', component: TaskComponent },
                      { path: 'my_tasks', component: TaskComponent },
                      { path: 'task/:id', component: TaskComponent }
                  ],
            },
            { path: 'totest', component: TotestComponent },
            { path: '', redirectTo: '/search', pathMatch: 'full' }
        ]
    }
];
