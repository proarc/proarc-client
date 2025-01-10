import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './shared/auth.guard';
import { TotestComponent } from './pages/totest/totest.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, ,
    {
        path: '', canActivate: [AuthGuard], children: [
            // { path: 'repository/:pid', component: RepositoryComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
            // { path: 'kramerius/:pid', component: KrameriusComponent },
            { path: 'settings', component: SettingsComponent },
            // { path: 'devices', component: DevicesComponent },
            // { path: 'devices/new', component: EditDeviceComponent },
            // { path: 'devices/:id', component: DeviceComponent },
            // { path: 'devices/:id/edit', component: EditDeviceComponent },
            // { path: 'devices/:device_id/audio/new', component: EditAudioDeviceComponent },
            // { path: 'devices/:device_id/audio/:id/edit', component: EditAudioDeviceComponent },
            // { path: 'search', component: SearchComponent },
            // { path: 'viewer', component: ViewerComponent },
            // { path: 'import', component: ImportComponent },
            // { path: 'process-management', component: ProcessManagementComponent },
            // { path: 'import/edit/:batch_id', component: BatchesComponent, canDeactivate: [ConfirmLeaveEditorGuard] },
            // { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
            // { path: 'admin/:id/edit-user', component: EditUserComponent },
            // { path: 'admin/new-user', component: NewUserComponent },
            // { path: 'workflow', loadChildren: () => import('../pages/workflow/workflow.module').then(m => m.WorkFlowModule) },
            { path: 'totest', component: TotestComponent },
            { path: '', redirectTo: '/settings', pathMatch: 'full' }
        ]
    }
];