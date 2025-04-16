import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { WorkFlowComponent } from './pages/workflow/workflow.component';
import { TaskComponent } from './pages/workflow/task/task.component';

export const routesWorkflow: Routes = [
    { path: '', component: WorkFlowComponent },
    { path: 'jobs', component: WorkFlowComponent },
    { path: 'jobs/:id', component: WorkFlowComponent },
    { path: 'tasks', component: TaskComponent },
    { path: 'my_tasks', component: TaskComponent },
    { path: 'task/:id', component: TaskComponent }
];
