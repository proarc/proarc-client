import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkFlowComponent } from './workflow.component';
import { NewJobDialogComponent } from './new-job-dialog/new-job-dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TaskComponent } from './task/task.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { MaterialEditComponent } from './material-edit/material-edit.component';
import { MatMenuModule } from '@angular/material/menu';
import { JobsEditDialogComponent } from './jobs-edit-dialog/jobs-edit-dialog.component';
import { TaskssEditDialogComponent } from './tasks-edit-dialog/tasks-edit-dialog.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', component: WorkFlowComponent },
  { path: 'jobs', component: WorkFlowComponent },
  { path: 'jobs/:id', component: WorkFlowComponent },
  { path: 'tasks', component: TaskComponent },
  { path: 'my_tasks', component: TaskComponent },
  { path: 'task/:id', component: TaskComponent }
];

@NgModule({
  declarations: [
    WorkFlowComponent,
    NewJobDialogComponent,
    TaskComponent,
    TaskEditComponent,
    MaterialEditComponent,
    JobsEditDialogComponent,
    TaskssEditDialogComponent,
    
  ],
  imports: [
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      defaultLanguage: 'cs',
      extend: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class WorkFlowModule { }
