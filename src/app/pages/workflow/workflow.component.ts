import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { transformGeometryWithOptions } from 'ol/format/Feature';
import { WorkFlow, WorkFlowMaterial, WorkFlowProfile, WorkFlowProfileSubjob } from 'src/app/model/workflow.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { NewJobDialogComponent } from './new-job-dialog/new-job-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { LayoutAdminComponent } from 'src/app/dialogs/layout-admin/layout-admin.component';

// -- table to expand --
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Sort, SortDirection } from '@angular/material/sort';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { User } from 'src/app/model/user.model';
import { ColumnsSettingsDialogComponent } from 'src/app/dialogs/columns-settings-dialog/columns-settings-dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NewObjectData, NewObjectDialogComponent } from 'src/app/dialogs/new-object-dialog/new-object-dialog.component';
import { NewMetadataDialogComponent } from 'src/app/dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { WorkFlowTree } from './workflowTree.model';
import { forkJoin } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { JobsEditDialogComponent } from './jobs-edit-dialog/jobs-edit-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { Device } from 'src/app/model/device.model';
// -- table to expand --

@Component({
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

  state: string;

  columnsWorkFlow: { field: string, selected: boolean, type: string }[];
  colsWidth: { [key: string]: number } = {};
  columnsWorkFlowSubJobs: { field: string, selected: boolean, type: string }[];
  colsWidthSubJobs: { [key: string]: number } = {};
  columnsTasks: { field: string, selected: boolean, type: string }[];
  colsWidthTasks: { [key: string]: number } = {};

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
  visibleSubJobs: WorkFlow[] = [];
  public subJobsTree: WorkFlowTree;
  selectedSubJob: WorkFlow;
  subJobsMaxLevel = 0;

  // jobsSortField: string = 'created';
  // jobsSortDir: SortDirection = 'desc';
  // subjobsSortField: string = 'created';
  // subjobsSortDir: SortDirection = 'desc';

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
    public properties: LocalStorageService,
    private translator: TranslateService,
    public auth: AuthService,
    private config: ConfigService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.columnsWorkFlow = this.properties.getColumnsWorkFlow();
    this.columnsWorkFlowSubJobs = this.properties.getColumnsWorkFlowSubJobs();
    this.columnsTasks = this.properties.getColumnsWorkFlowTasks();
    this.allTasks = this.config.getValueMap('proarc.workflow.tasks');

    // this.api.getUsers().subscribe((users: User[]) => {
    //   this.users = users;
    // });
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

      this.lists['taskName'] = this.getList('taskName');
      this.setSelectedColumns();
      // this.jobsSortField = this.workFlowColumns[0];
      this.setSelectedColumnsSubJobs();
      this.setSelectedColumnsTasks();
      this.getWorkflow(false);
    });
  }

  // getXML(id: string) {
  //   this.api.getWorkflowXML(id).subscribe((response: any) => {
  //     console.log(response)
  //   });
  // }

  getWorkflow(keepSelection: boolean) {
    this.state = 'loading';
    let id = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : null;
    if (keepSelection) {
      id = this.selectedJob.id;
    }
    this.jobs = [];
    this.subJobs = [];
    let params = '?';
    params += '_sortBy=' + (this.layout.workflowJobsSort.direction === 'desc' ? '-' : '') + this.layout.workflowJobsSort.field;

    const keys: string[] = Object.keys(this.layout.workflowJobsFilters);
    keys.forEach((k: string) => {
      if (this.layout.workflowJobsFilters[k] !== '') {
        params += `&${k}=${this.layout.workflowJobsFilters[k]}`;
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
      this.layout.ready = true;
    });
  }

  getSubJobs(job: WorkFlow) {

    let params = '?parentId=' + job.id;
    params += '&_sortBy=' + (this.layout.workflowSubjobsSort.direction === 'desc' ? '-' : '') + this.layout.workflowSubjobsSort.field;

    this.api.getWorkflow(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }

      job.expanded = true;
      job.childrenLoaded = true;
      job.hasChildren = response.response.data.length > 0;

      const idx = this.subJobs.findIndex(j => j.id === job.id) + 1;

      response.response.data.forEach((j: WorkFlow) => {
        j.level = job.level + 1;
        j.expandable = this.isExpandable(j);
      });

      if (response.response.data.length > 0) {
        this.subJobsMaxLevel = Math.max(job.level + 1, this.subJobsMaxLevel);
      }

      this.subJobs.splice(idx, 0, ...response.response.data);

      this.refreshVisibleSubJobs();
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
    this.getSubJobs(this.selectedJob);
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

  openTask(id: string) {
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
    this.layout.workflowJobsSort = {field: e.active, direction: e.direction};
    this.getWorkflow(false);
  }

  sortSubjobsTable(e: Sort) {
    this.layout.workflowSubjobsSort = {field: e.active, direction: e.direction};
    //this.getSubJobs();
  }

  sortTasksTable(e: Sort) {
    this.tasksSortDir = e.direction;
    this.tasksSortField = e.active;
    this.getTasks();
  }

  filter(field: string, value: string) {
    // const f = this.filters.find(f => f.field === field);
    // if (this.filters[field]) {
    //   f.value = value;
    // } else {
    //   this.filters.push({ field, value });
    // }
    this.layout.workflowJobsFilters[field] = value;
    this.getWorkflow(false);
  }

  selectColumns(type: string) {
    const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
      data: {
        type: type,
        isRepo: false,
        isImport: false,
        isWorkFlow: type === 'jobs',
        isWorkFlowSubJobs: type === 'subjobs',
        isWorkFlowTasks: type === 'tasks'
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch(type) {
          case 'jobs':
          this.columnsWorkFlow = this.properties.getColumnsWorkFlow();
          this.setSelectedColumns();
          break;
          case 'subjobs':
          this.columnsWorkFlowSubJobs = this.properties.getColumnsWorkFlowSubJobs();
          this.setSelectedColumnsSubJobs();
          break;
          case 'tasks':
          this.columnsTasks = this.properties.getColumnsWorkFlowTasks();
          this.setSelectedColumnsTasks();
          break;
          default:

        }

      }
    });
  }

  columnType(f: string) {
    return this.columnsWorkFlow.find(c => c.field === f).type;
  }

  columnTasksType(f: string) {
    return this.columnsTasks.find(c => c.field === f).type;
  }

  getList(f: string): { code: string, value: string }[] {
    switch (f) {
      case 'priority': return this.priorities.map(p => { return { code: p.code + '', value: p.value } });
      case 'state': return this.states.map(p => { return { code: p.code, value: p.value } });
      case 'profileName': return this.profiles.map(p => { return { code: p.name + '', value: p.title } });
      case 'deviceID': return this.devices.map(p => { return { code: p.id + '', value: p.label } });
      case 'ownerId': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'taskName': return this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
      case 'taskUser': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'model': return this.config.allModels.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
      default: return [];
    }
  }

  listValue(field: string, code: string) {
    // field profileName je rozdilne pro job a task
    // pro job bereme z profiles
    // pro task z allTasks
    const el = this.lists[field].find(el => el.code === code + '');
    return el ? el.value : code;
  }

  translatedField(f: string): string {
    switch (f) {
      case 'taskName': return 'taskLabel'
      default: return f
    }
  }


  setSelectedColumns() {

    this.workFlowColumns = this.columnsWorkFlow.filter(c => c.selected).map(c => c.field);
    this.filterWorkFlowColumns = [];
    this.workFlowColumns.forEach(c => {
      this.filterWorkFlowColumns.push(c + '-filter');
      this.filterFields[c] = this.layout.workflowJobsFilters[c];
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnType(c);

    });
    this.setColumnsWith();
  }

  setSelectedColumnsSubJobs() {

    this.workFlowColumnsSubJobs = this.columnsWorkFlowSubJobs.filter(c => c.selected).map(c => c.field);
    this.workFlowColumnsSubJobs.forEach(c => {
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnType(c);
    });

    this.setColumnsWithSubJobs();
  }

  setSelectedColumnsTasks() {

    this.workFlowColumnsTasks = this.columnsTasks.filter(c => c.selected).map(c => c.field);
    this.workFlowColumnsTasks.forEach(c => {
      if (this.columnTasksType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnTasksType(c);
    });

    this.setColumnsWidthTasks();
  }

  setColumnsWith() {
    this.colsWidth = {};
    this.columnsWorkFlow.forEach((c: any) => {
      this.colsWidth[c.field] = c.width;
    });
  }

  setColumnsWithSubJobs() {
    this.colsWidthSubJobs = {};
    this.columnsWorkFlowSubJobs.forEach((c: any) => {
      this.colsWidthSubJobs[c.field] = c.width;
    });
  }

  setColumnsWidthTasks() {
    this.colsWidthTasks = {};
    this.columnsTasks.forEach((c: any) => {
      this.colsWidthTasks[c.field] = c.width;
    });
  }

  saveColumnsSizes(e: any, field?: string) {
    this.colsWidth[field] = e;
    this.columnsWorkFlow.forEach((c: any) => {
      c.width = this.colsWidth[c.field];
    });

    this.properties.setColumnsWorkFlow(this.columnsWorkFlow);
  }

  saveColumnsSizesSubJobs(e: any, field?: string) {
    this.colsWidthSubJobs[field] = e;
    this.columnsWorkFlowSubJobs.forEach((c: any) => {
      c.width = this.colsWidthSubJobs[c.field];
    });
    this.properties.setColumnsWorkFlowSubJobs(this.columnsWorkFlowSubJobs);
  }

  saveColumnsSizesTasks(e: any, field?: string) {
    this.colsWidthTasks[field] = e;
    this.columnsTasks.forEach((c: any) => {
      c.width = this.colsWidthTasks[c.field];
    });
    this.properties.setColumnsWorkFlowTasks(this.columnsTasks);
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

  subJobClick(item: WorkFlow, event?: MouseEvent, idx?: number) {
    if (event && (event.metaKey || event.ctrlKey)) {
      item.selected = !item.selected;
      this.startShiftClickIdx = idx;
    } else if (event && event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.subJobs[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, idx);
        const to = Math.max(this.startShiftClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.subJobs[i].selected = true;
        }
      } else {
        // nic neni.
        this.subJobs.forEach(i => i.selected = false);
        item.selected = true;
        this.startShiftClickIdx = idx;
      }
    } else {
      this.subJobs.forEach(i => i.selected = false);
      item.selected = true;
      this.startShiftClickIdx = idx;
    }

    this.lastClickIdx = idx;
    this.totalSelected = this.subJobs.filter(i => i.selected).length;

    if (this.totalSelected > 0) {
      this.selectSubJob(item);
    }
  }

  selectSubJob(job: WorkFlow) {
    this.selectedSubJob = job;
    this.activeJob = job;

    // this.subJobs.forEach(j => j.selected = false);
    // job.selected = true;

    this.selectedSubJobProfile = this.profiles.find(p => p.name === job.profileName);
    if (!job.childrenLoaded) {
      this.getSubJobs(job);
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
        this.getSubJobs(job);
      }
    } else {
      job.expanded = false;
    }

    this.setToHidden(job, this.subJobs.indexOf(job));
    this.refreshVisibleSubJobs();
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

  refreshVisibleSubJobs() {
    this.visibleSubJobs = this.subJobs.filter(j => !j.hidden);
    this.subJobsTable.renderRows();
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

  jobClick(item: WorkFlow, event?: MouseEvent, idx?: number) {
    if (event && (event.metaKey || event.ctrlKey)) {
      item.selected = !item.selected;
      this.startShiftClickIdx = idx;
    } else if (event && event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.jobs[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, idx);
        const to = Math.max(this.startShiftClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.jobs[i].selected = true;
        }
      } else {
        // nic neni.
        this.jobs.forEach(i => i.selected = false);
        item.selected = true;
        this.startShiftClickIdx = idx;
      }
    } else {
      this.jobs.forEach(i => i.selected = false);
      item.selected = true;
      this.startShiftClickIdx = idx;
    }

    this.lastClickIdx = idx;
    this.totalSelected = this.jobs.filter(i => i.selected).length;

    if (this.totalSelected > 0) {
      this.selectJob(item);
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
