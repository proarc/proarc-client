import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

// -- table to expand --
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { forkJoin } from 'rxjs';
import { MatTable, MatTableModule } from '@angular/material/table';
import { JobsEditDialogComponent } from './jobs-edit-dialog/jobs-edit-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';
import { LayoutAdminComponent } from '../../dialogs/layout-admin/layout-admin.component';
import { NewMetadataDialogComponent } from '../../dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { NewObjectData, NewObjectDialogComponent } from '../../dialogs/new-object-dialog/new-object-dialog.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { Device } from '../../model/device.model';
import { User } from '../../model/user.model';
import { WorkFlowProfile, WorkFlow, WorkFlowMaterial } from '../../model/workflow.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { MaterialEditComponent } from "./material-edit/material-edit.component";
import { UserTreeTableComponent } from "../../components/user-tree-table/user-tree-table.component";

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    AngularSplitModule, MatTableModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule,
    MatSortModule, UserTableComponent, MaterialEditComponent, UserTreeTableComponent],
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  // -- table to expand --
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  // -- table to expand --
})

export class WorkFlowComponent implements OnInit {


  @ViewChild('subJobsTable') subJobsTable: MatTable<any>;

  loading: boolean;
  state: string;

  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'note'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --


  profiles: WorkFlowProfile[];
  devices: Device[];
  allTasks: any[];
  selectedProfile: WorkFlowProfile;
  selectedSubJobProfile: WorkFlowProfile;

  workFlowColumns = ['taskUsername', 'label', 'profileName'];
  filterWorkFlowColumns: string[] = [];
  columnTypes: {[field: string]: string} = {};

  workFlowColumnsSubJobs = ['taskUsername', 'label', 'profileName'];
  workFlowColumnsTasks = ['taskUsername', 'label', 'profileName'];

  allJobs: WorkFlow[] = [];
  jobs: WorkFlow[] = [];
  selectedJob: WorkFlow;
  activeJob: WorkFlow;
  hasObject: boolean;

  hasMetadata: boolean;
  physicalDocument: any;

  subJobs: WorkFlow[] = [];
  visibleSubJobs: any[] = [];
  selectedSubJob: WorkFlow;
  subJobsMaxLevel = 0;

  workflowJobsSort: Sort = {active: 'created', direction: 'desc'} ;
  workflowJobsFilters: { [field: string]: string } = {};

  workflowSubjobsSort: Sort = {active: 'created', direction: 'desc'} ;

  selectedTask: any;

  materials: WorkFlowMaterial[];
  taskColumns = ['label', 'user', 'state'];
  tasks: any[];
  tasksSortField: string = 'created';
  tasksSortDir: SortDirection = 'desc';

  states = [
    { code: 'OPEN', value: 'Otevřený' },
    { code: 'FINISHED', value: 'Hotový' },
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
  // taskUsernameFilter: string;
  // labelFilter: string;
  // profileNameFilter: string;

  startShiftClickIdx: number;
  lastClickIdx: number;
  totalSelected: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private translator: TranslateService,
    public auth: AuthService,
    private config: Configuration,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
    // this.columnsWorkFlow = this.properties.getColumnsWorkFlow();
    // this.columnsWorkFlowSubJobs = this.properties.getColumnsWorkFlowSubJobs();
    // this.columnsTasks = this.properties.getColumnsWorkFlowTasks();
    this.allTasks = this.config.getValueMap('proarc.workflow.tasks');

    this.getWorkflowProfiles();
  }

  showLayoutAdmin() {
    const dialogRef = this.dialog.open(LayoutAdminComponent, {
      data: { layout: 'import' },
      width: '1280px',
      height: '90%',
      panelClass: 'app-dialog-layout-settings'
    });
    dialogRef.afterClosed().subscribe((ret: any) => {

      // this.initConfig();
      // this.loadData(this.batchId, true);
    });
  }

  getWorkflowProfiles() {
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
      this.getWorkflow(false);
    });
  }

  getWorkflow(keepSelection: boolean) {
    this.loading = true;
    let id = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : null;
    if (keepSelection) {
      id = this.selectedJob.id;
    }
    this.jobs = [];
    this.subJobs = [];
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
        this.state = 'error';
        return;
      }
      this.allJobs = response.response.data;
      this.jobs = this.allJobs.filter(j => !j.parentId);
      this.jobs.forEach(j => {
        j.level = 0;
        j.expandable = this.isExpandable(j);
      });
      if (id) {
        const job = this.jobs.find(j => j.id === id);
        this.selectedJob = null;
        this.selectJob(job);
      } else {
        this.selectJob(this.jobs[0]);
      }
      this.state = 'success';
      this.loading = false;
    });
  }

  

  getMaterial() {
    this.api.getWorkflowMaterial(this.activeJob.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.materials = response.response.data;
      this.hasObject = !!this.materials.find(m => m.type === 'DIGITAL_OBJECT')?.pid;
      this.physicalDocument = this.materials.find(m => m.type === 'PHYSICAL_DOCUMENT');
      this.hasMetadata = !!this.physicalDocument;
    });
  }

  getTasks() {
    let params = '?jobId=' + this.activeJob.id;
    if (this.tasksSortDir) {
      params += '&_sortBy=' + (this.tasksSortDir === 'desc' ? '-' : '') + this.tasksSortField;
    }

    this.api.getWorkflowTasks(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;
    });
  }

  saveDetail() {
    this.api.saveWorkflowItem(this.activeJob).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;
    });

  }

  getDetail() {
    this.api.getWorkflowItem(this.activeJob.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.selectedJob = response.response.data[0];
    });
  }

  refreshSubJobs() {
    this.subJobsMaxLevel = 0;
    this.subJobs = [this.selectedJob];
  }

  isExpandable(job: WorkFlow) {

    const p = this.profiles.find(p => p.name === job.profileName);
    if (!p) {
      console.log('PROBLEM!! Neni mezi profiles', job.profileName);
      return false;
    }
    return  p.subjob.length > 0;
  }

  selectJob(w: WorkFlow) {
    if (!w || w.id === this.selectedJob?.id) {
      return;
    }
    // this.jobs.forEach(j => j.selected = false);
    w.selected = true;
    this.selectedJob = w;
    this.activeJob = w;
    this.selectedProfile = this.profiles.find(p => p.name === w.profileName);
    this.getMaterial();
    this.getTasks();
    this.refreshSubJobs();

    setTimeout(() => {
      const el = document.getElementById('w_' + w.id);
      if (el) {
        el.scrollIntoView({ block: 'center' });
      }
    }, 100)

  }

  createJob(profiles: WorkFlowProfile[], profile: WorkFlowProfile, parentId: number) {

    const models: string[] = profiles.map(p => p.name)

    const data: NewObjectData = {
      profiles: profiles,
      profile: profile,
      models: models,
      model: models[0],
      parentId: parentId,
      customPid: false,
      parentPid: null,
      fromNavbar: false,
      isJob: true
    }
    const dialogRef1 = this.dialog.open(NewObjectDialogComponent, {
      data: data,
      width: '680px',
      panelClass: 'app-dialog-new-object'
    });
    dialogRef1.afterClosed().subscribe((result: any) => {
      if (result && result['data']) {
        this.api.getWorkflowMods(result.data.id, result.data.model).subscribe(mods => {
          const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
            disableClose: true,
            height: '90%',
            width: '680px',
            data: {
              isWorkFlow: true,
              jobId: result.data.id,
              model: result.data.model,
              timestamp: result.data.timestamp,
              content: mods.record.content,
              selectedProfile: result.data.profileName
            }
          });
          dialogRef.afterClosed().subscribe(res => {
            if (res?.item) {
              this.getWorkflow(true);
            }
          });

        });
      }
    });
  }

  createSubJob(job: WorkFlow) {
    const jobProfile = this.profiles.find(p => p.name === job.profileName);
    const profiles = this.profiles.filter(p => jobProfile.subjob.find(sj => sj.name === p.name));
    this.createJob(profiles, profiles[0], job.id)
  }

  createNewObject(model: string) {
    const data: SimpleDialogData = {
      title: "Přidat nový digitální objekt s parametry.",
      textInput: { label: 'PID', value: '' },
      btn1: {
        label: "OK",
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: "Storno",
        value: 'no',
        color: 'default'
      },
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        //console.log(data.textInput.value)
        let params = `model=${model}`;
        params = `${params}&validate=false&jobId=${this.activeJob.id}`;
        if (data.textInput.value !== '') {
          params = `${params}&pid=${data.textInput.value}`;
        }
        this.api.createObject(params).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            return;
          }
          this.getWorkflow(true);
        });
      }
    });
  }

  openTask(e: {item: WorkFlow, event?: MouseEvent, idx?: number}) {
    this.router.navigate(['workflow/task', e.item.id])
  }

  openTask_(id: string) {
    this.router.navigate(['workflow/task', id])
  }

  addStep(profile: string) {
    let data = `profileName=${profile}&jobId=${this.activeJob.id}`;
    this.api.addWorflowTask(data).subscribe((response: any) => {

      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        // this.state = 'error';
        return;
      }
      this.getTasks();
    });
  }

  sortJobsTable(e: Sort) {
    this.workflowJobsSort = {active: e.active, direction: e.direction};
    this.getWorkflow(false);
  }

  sortTasksTable(e: Sort) {
    this.tasksSortDir = e.direction;
    this.tasksSortField = e.active;
    this.getTasks();
  }

  filter(field: string, value: string) {
    this.workflowJobsFilters[field] = value;
    this.getWorkflow(false);
  }

  removeJobs(isSubJobs: boolean) {
    const selection = isSubJobs ? this.subJobs.filter(j => j.selected) : this.jobs.filter(j => j.selected);
    const selectionHasChildren: boolean = selection.findIndex(j => j.hasChildren) > -1;
    const pids: number[] = selection.map(j => j.id);
    const pref = isSubJobs ? 'dialog.removeSubjobs' : 'dialog.removeJobs'
    const message = selectionHasChildren ?
                  String(this.translator.instant(pref + '.messageChildren')) + ' (' + pids.length + ')' :
                  String(this.translator.instant(pref + '.message')) + ' (' + pids.length + ')';

    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.removeJobs.title')),
      message: message,
      alertClass: 'app-warn',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.api.removeWorkflow(pids.join('&id=')).subscribe(res => {
          this.getWorkflow(isSubJobs);
        })
      }
    });
  }

  subJobClick(e:{item: WorkFlow, event?: MouseEvent, idx?: number}) {
    if (e.event && (e.event.metaKey || e.event.ctrlKey)) {
      e.item.selected = !e.item.selected;
      this.startShiftClickIdx = e.idx;
    } else if (e.event && e.event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.subJobs[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, e.idx);
        const to = Math.max(this.startShiftClickIdx, e.idx);
        for (let i = from; i <= to; i++) {
          this.subJobs[i].selected = true;
        }
      } else {
        // nic neni.
        this.subJobs.forEach(i => i.selected = false);
        e.item.selected = true;
        this.startShiftClickIdx = e.idx;
      }
    } else {
      this.subJobs.forEach(i => i.selected = false);
      e.item.selected = true;
      this.startShiftClickIdx = e.idx;
    }

    this.lastClickIdx = e.idx;
    this.totalSelected = this.subJobs.filter(i => i.selected).length;

    if (this.totalSelected > 0) {
      this.selectSubJob(e.item);
    }
  }

  selectSubJob(job: any) {
    this.selectedSubJob = job;
    this.activeJob = job;

    // this.subJobs.forEach(j => j.selected = false);
    // job.selected = true;

    this.selectedSubJobProfile = this.profiles.find(p => p.name === job.profileName);
    if (!job.childrenLoaded) {
      //this.getSubJobs(job);
    }


    this.getMaterial();
    this.getTasks();

  }

  toggle(event: any, job: WorkFlow) {
    event.stopPropagation();
    event.preventDefault();
    if (!job.expanded) {
      job.expanded = true;
      if (!job.childrenLoaded) {
        //this.getSubJobs(job);
      }
    } else {
      job.expanded = false;
    }

    this.setToHidden(job, this.subJobs.indexOf(job));
    
  }

  setToHidden(job: WorkFlow, idx: number) {
    for (let i = idx; i < this.subJobs.length; i++) {
      const j = this.subJobs[i]
      if (j.parentId === job.id) {
        j.hidden = !job.expanded || job.hidden;
        this.setToHidden(j, i)
      }
    }
  }

  

  taskStep(task: string) {

  }

  editMetadata() {

    //this.api.getWorkflowMods(this.material.id, this.material.model).subscribe(mods => {
      const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
        disableClose: true,
        height: '90%',
        width: '680px',
        data: {
          title: 'dialog.newMetadata.title_edit',
          isWorkFlow: true,
          isWorkFlowMaterial: true,
          jobId: this.selectedJob.id,
          model: this.selectedJob.model,
          timestamp: this.selectedJob.timestamp,
          content: this.physicalDocument.metadata,
          selectedProfile: this.selectedJob.profileName
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res?.mods) {
          this.physicalDocument.metadata = res.mods;
          this.saveMetadata();
        }
      });

    //});
  }

  saveMetadata() {
    this.api.saveWorkflowMaterial(this.physicalDocument).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.physicalDocument = response.response.data[0];
      this.getWorkflow(true);
    });
  }

  filterMyTasks() {
    let params = '?jobId=' + this.activeJob.id;
    if (this.tasksSortDir) {
      params += '&_sortBy=' + (this.tasksSortDir === 'desc' ? '-' : '') + this.tasksSortField;
    }
    params += '&state=READY&ownerId=' + this.auth.getUserId();
    this.api.getWorkflowTasks(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;
    });
  }

  jobClick(e: {item: WorkFlow, event?: MouseEvent, idx?: number}) {
    if (e.event && (e.event.metaKey || e.event.ctrlKey)) {
      e.item.selected = !e.item.selected;
      this.startShiftClickIdx = e.idx;
    } else if (e.event && e.event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.jobs[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, e.idx);
        const to = Math.max(this.startShiftClickIdx, e.idx);
        for (let i = from; i <= to; i++) {
          this.jobs[i].selected = true;
        }
      } else {
        // nic neni.
        this.jobs.forEach(i => i.selected = false);
        e.item.selected = true;
        this.startShiftClickIdx = e.idx;
      }
    } else {
      this.jobs.forEach(i => i.selected = false);
      e.item.selected = true;
      this.startShiftClickIdx = e.idx;
    }

    this.lastClickIdx = e.idx;
    this.totalSelected = this.jobs.filter(i => i.selected).length;

    if (this.totalSelected > 0) {
      this.selectJob(e.item);
    }
  }

  editJobs() {
    const dialogRef = this.dialog.open(JobsEditDialogComponent, {
      // disableClose: true,
      height: '80%',
      width: '680px',
      data: {
        states: this.states,
        priorities: this.priorities,
        ids: this.jobs.filter(i => i.selected).map(p => p.id)
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getWorkflow(false);
      }
    });
  }

  copyTextToClipboard(val: string) {
    this.clipboard.copy(val);
    this.ui.showInfoSnackBar(this.translator.instant('snackbar.copyTextToClipboard.success'));
  }

}
