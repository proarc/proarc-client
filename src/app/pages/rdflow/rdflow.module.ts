import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RDFlowComponent } from './rdflow.component';
import { NewWorkflowDialogComponent } from './new-workflow-dialog/new-workflow-dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TaskComponent } from './task/task.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/api/assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', component: RDFlowComponent },
  { path: 'task/:id', component: TaskComponent }
];

@NgModule({
  declarations: [
    RDFlowComponent,
    NewWorkflowDialogComponent,
    TaskComponent
  ],
  imports: [
    SharedModule,
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
export class RDFlowModule { }
