import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout-service';
import { UIService } from '../../../services/ui.service';
import { Configuration } from '../../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../../shared/user-settings';
import { WorkFlow } from '../../../model/workflow.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { WfConfiguration } from '../wf-configuration';

@Component({
  selector: 'app-job',
  imports: [FormsModule, MatProgressBarModule],
  templateUrl: './job.component.html',
  styleUrl: './job.component.scss'
})
export class JobComponent {

  loading = signal<boolean>(false);
  job: WorkFlow;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public wfconfig: WfConfiguration,
    private translator: TranslateService,
    public auth: AuthService,
    public config: Configuration,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    if (this.wfconfig.inited) {
      this.getJob();
    } else {
      this.wfconfig.getWorkflowProfiles(() => {this.getJob()});
    }
  }

  getJob() {
    this.loading.set(true);
    let id = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : null;
    let params = '?';
    params += 'id=' + id;

    this.api.getWorkflow(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.job = response.response.data[0];
      this.loading.set(false);
    });
  }

}
