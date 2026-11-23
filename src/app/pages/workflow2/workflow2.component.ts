import { Component, signal } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { WorkFlow, WorkFlowProfile } from '../../model/workflow.model';
import { LayoutService } from '../../services/layout-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { UserTableColoredComponent } from '../../components/user-table-colored/user-table-colored.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin } from 'rxjs';
import { Device } from '../../model/device.model';
import { User } from '../../model/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workflow2',
  imports: [UserTableColoredComponent, MatProgressBarModule],
  templateUrl: './workflow2.component.html',
  styleUrl: './workflow2.component.scss'
})
export class Workflow2Component {

  loading = signal<boolean>(false);

  
  allTasks: any[];
    profiles: WorkFlowProfile[];
    devices: Device[];

    allJobs: WorkFlow[] = [];
    jobs: WorkFlow[] = [];
    selectedJob: WorkFlow;
  
  workflowJobsSort: Sort = {active: 'created', direction: 'desc'} ;
  workflowJobsFilters: { [field: string]: string } = {};


  states = [
    { code: 'OPEN', value: 'Otevřený' },
    { code: 'FINISHED', value: 'Hotový' },
    { code: 'READY', value: 'Připraven' },
    { code: 'STARTED', value: 'Probíhá' },
    { code: 'CANCELED', value: 'Zrušený' },
  ]

  priorities = [
    { code: 1, value: 'Spěchá' },
    { code: 2, value: 'Normální' },
    { code: 3, value: 'Nízká' },
    { code: 4, value: 'Odloženo' },
  ]

  users: User[];
  filterFields: { [field: string]: string } = {};
  lists: { [field: string]: { code: string, value: string }[] } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //private dialog: MatDialog,
    private translator: TranslateService,
    public auth: AuthService,
    private config: Configuration,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    this.allTasks = this.config.getValueMap('proarc.workflow.tasks');
    this.getWorkflowProfiles();
  }

  getWorkflowProfiles() {
      const profileNames = this.config.getValueMap('proarc.workflow.tasks');
      const rUsers = this.api.getUsers();
      const rProfiles = this.api.getWorkflowProfiles();
      const rDevices = this.api.getDevices();
      forkJoin([rUsers, rProfiles, rDevices]).subscribe(([users, profiles, devices]: [User[], any, Device[]]) => {
        this.users = users;
  
        if (profiles['response'].errors) {
          this.ui.showErrorDialogFromObject(profiles['response'].errors);
          return;
        }
        this.profiles = profiles.response.data;
        this.devices = devices;
        this.lists['model'] = this.config.models.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
        this.lists['taskUser'] = this.users.map(p => { return { code: p.userId + '', value: p.name } });
        this.lists['state'] = this.states.map(p => { return { code: p.code, value: p.value } });
        this.lists['ownerId'] = this.users.map(p => { return { code: p.userId + '', value: p.name } });
        this.lists['priority'] = this.priorities.map(p => { return { code: p.code + '', value: p.value } });
        this.lists['profileName'] = [...this.profiles.map(p => { return { code: p.name + '', value: p.title } })
          , ...profileNames.map(p => { return { code: p.name + '', value: p.title } })
        ];
        
        //this.lists['profileName'] = profileNames.map(p => { return { code: p.name + '', value: p.title } });
  
        this.lists['deviceId'] = this.devices.map(p => { return { code: p.id + '', value: p.label } });
        this.lists['taskName'] = this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
        this.getWorkflow(false);
      });
    }

  sortJobsTable(e: Sort) {
    this.workflowJobsSort = {active: e.active, direction: e.direction};
    this.getWorkflow(false);
  }

  openJob(item: WorkFlow) {
    this.router.navigate([item.id], {relativeTo: this.route})
  }

  jobClick(e: {item: WorkFlow, event?: MouseEvent, idx?: number}) {
    // if (e.event && (e.event.metaKey || e.event.ctrlKey)) {
    //   e.item.selected = !e.item.selected;
    //   this.startShiftClickIdx = e.idx;
    // } else if (e.event && e.event.shiftKey) {
    //   if (this.startShiftClickIdx > -1) {
    //     const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
    //     const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
    //     for (let i = oldFrom; i <= oldTo; i++) {
    //       this.jobs[i].selected = false;
    //     }
    //     const from = Math.min(this.startShiftClickIdx, e.idx);
    //     const to = Math.max(this.startShiftClickIdx, e.idx);
    //     for (let i = from; i <= to; i++) {
    //       this.jobs[i].selected = true;
    //     }
    //   } else {
    //     // nic neni.
    //     this.jobs.forEach(i => i.selected = false);
    //     e.item.selected = true;
    //     this.startShiftClickIdx = e.idx;
    //   }
    // } else {
    //   this.jobs.forEach(i => i.selected = false);
    //   e.item.selected = true;
    //   this.startShiftClickIdx = e.idx;
    // }

    // this.lastClickIdx = e.idx;
    // this.totalSelected = this.jobs.filter(i => i.selected).length;

    // if (this.totalSelected > 0) {
    //   this.selectJob(e.item);
    // }
  }

  filter(e : {field: string, value: string}) {
    this.workflowJobsFilters[e.field] = e.value;
    this.getWorkflow(false);
  }

  getWorkflow(keepSelection: boolean) {
    this.loading.set(true);
    // let id = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : null;
    // if (keepSelection) {
    //   id = this.selectedJob.id;
    // }
    this.jobs = [];
    let params = '?';
    params += '_sortBy=' + (this.workflowJobsSort.direction === 'desc' ? '-' : '') + this.workflowJobsSort.active;

    const keys: string[] = Object.keys(this.workflowJobsFilters);
    keys.forEach((k: string) => {
      if (this.workflowJobsFilters[k] !== '') {
        params += `&${k}=${this.workflowJobsFilters[k]}`;
      }
    });

    this.api.getWorkflow(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.allJobs = response.response.data;
      this.jobs = this.allJobs.filter(j => !j.parentId);
      this.jobs.forEach(j => {
        j.level = 0;
        // j.expandable = this.isExpandable(j);
      });
      // if (id) {
      //   const job = this.jobs.find(j => j.id === id);
      //   this.selectedJob = null;
      //   this.selectJob(job);
      // } else {
      //   this.selectJob(this.jobs[0]);
      // }
      this.loading.set(false);
    });
  }

}
