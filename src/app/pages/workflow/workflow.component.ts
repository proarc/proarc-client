import { Component, OnInit } from '@angular/core';
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

  columnsWorkFlow: { field: string, selected: boolean, type: string }[];
  colsWidth: { [key: string]: string } = {};
  columnsWorkFlowSubJobs: { field: string, selected: boolean, type: string }[];
  colsWidthSubJobs: { [key: string]: string } = {};

  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'note'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --


  profiles: WorkFlowProfile[];
  allTasks: any[];
  selectedProfile: WorkFlowProfile;

  workFlowColumns = ['taskUsername', 'label', 'profileName'];
  filterWorkFlowColumns: string[] = [];

  workFlowColumnsSubJobs = ['taskUsername', 'label', 'profileName'];

  allJobs: WorkFlow[] = [];
  jobs: WorkFlow[] = [];
  subJobs: WorkFlow[] = [];
  selectedJob: WorkFlow;
  hasObject: boolean;

  jobsSortField: string = 'created';
  jobsSortDir: SortDirection = 'desc';
  subjobsSortField: string = 'created';
  subjobsSortDir: SortDirection = 'desc';


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
  filters: { [field: string]: string } = {};
  filterFields: { [field: string]: string } = {};
  lists: { [field: string]: { code: string, value: string }[] } = {};
  taskUsernameFilter: string;
  labelFilter: string;
  profileNameFilter: string;

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
    public layout: LayoutService) { }

  ngOnInit(): void {
    this.columnsWorkFlow = this.properties.getColumnsWorkFlow();
    this.columnsWorkFlowSubJobs = this.properties.getColumnsWorkFlowSubJobs();

    console.log(this.config.allModels)

    this.allTasks = this.config.getValueMap('proarc.workflow.tasks');

    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
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
    this.api.getWorkflowProfiles().subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.profiles = response.response.data;
      this.setSelectedColumns();
      this.setSelectedColumnsSubJobs();
      this.getWorkflow();
    });
  }

  // getXML(id: string) {
  //   this.api.getWorkflowXML(id).subscribe((response: any) => {
  //     console.log(response)
  //   });
  // }

  getWorkflow() {
    this.jobs = [];
    this.subJobs = [];
    let params = '?';
    if (this.jobsSortDir) {
      params += '_sortBy=' + (this.jobsSortDir === 'desc' ? '-' : '') + this.jobsSortField;
    }
    const keys: string[] = Object.keys(this.filters);
    keys.forEach((k: string) => {
      if (this.filters[k] !== '') {
        params += `&${k}=${this.filters[k]}`;
      }
    });

    this.api.getWorkflow(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.allJobs = response.response.data;
      this.jobs = this.allJobs.filter(j => !j.parentId);
      if (this.route.snapshot.params['id']) {
        const job = this.jobs.find(j => j.id === parseInt(this.route.snapshot.params['id']));
        this.selectJob(job);
      } else {
        this.selectJob(this.jobs[0]);
      }

      this.layout.ready = true;
    });
  }

  getSubJobs() {
    this.subJobs = [];

    let params = '?parentId=' + this.selectedJob.id;
    if (this.subjobsSortDir) {
      params += '&_sortBy=' + (this.subjobsSortDir === 'desc' ? '-' : '') + this.subjobsSortField;
    }

    this.api.getWorkflow(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.subJobs = response.response.data;
    });
  }

  getMaterial() {
    this.api.getWorkflowMaterial(this.selectedJob.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.materials = response.response.data;
      this.hasObject = !!this.materials.find(m => m.type === 'DIGITAL_OBJECT').pid
    });
  }

  getTasks() {
    let params = '?jobId=' + this.selectedJob.id;
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
    this.api.saveWorkflowItem(this.selectedJob).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;
    });

  }

  getDetail() {
    this.api.getWorkflowItem(this.selectedJob.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.selectedJob = response.response.data[0];
    });
  }

  selectJob(w: WorkFlow) {
    if (w.id === this.selectedJob?.id) {
      return;
    }
    this.selectedJob = w;
    this.selectedProfile = this.profiles.find(p => p.name === w.profileName);
    this.getMaterial();
    this.getTasks();
    this.getSubJobs();
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
      panelClass: 'app-dialog-new-bject'
    });
    dialogRef1.afterClosed().subscribe((result: any) => {
      if (result) {
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
              this.getWorkflow();
            }
          });

        });
      }
    });
  }

  createSubJob() {
    const profiles = this.profiles.filter(p => this.selectedProfile.subjob.find(sj => sj.name === p.name));
    this.createJob(profiles, profiles[0], this.selectedJob.id)
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
        console.log(data.textInput.value)
        let params = `model=${model}`;
        params = `${params}&jobId=${this.selectedJob.id}`;
        if (data.textInput.value !== '') {
          params = `${params}&pid=${data.textInput.value}`;
        }
        this.api.createObject(params).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            return;
          }
          this.getWorkflow();
        });
      }
    });
  }

  openTask(id: string) {
    this.router.navigate(['workflow/task', id])
  }

  sortJobsTable(e: Sort) {
    this.jobsSortDir = e.direction;
    this.jobsSortField = e.active;
    this.getWorkflow();
  }

  sortSubjobsTable(e: Sort) {
    this.subjobsSortDir = e.direction;
    this.subjobsSortField = e.active;
    this.getSubJobs();
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
    this.filters[field] = value;
    this.getWorkflow();
  }

  selectColumns(isSubJobs: boolean) {
    const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
      data: {
        isRepo: false,
        isWorkFlow: !isSubJobs,
        isWorkFlowSubJobs: isSubJobs
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (isSubJobs) {
          this.columnsWorkFlowSubJobs = this.properties.getColumnsWorkFlowSubJobs();
          this.setSelectedColumnsSubJobs();
        } else {
          this.columnsWorkFlow = this.properties.getColumnsWorkFlow();
          this.setSelectedColumns();
        }

      }
    });
  }

  columnType(f: string) {
    return this.columnsWorkFlow.find(c => c.field === f).type;
  }

  getList(f: string): { code: string, value: string }[] {
    switch (f) {
      case 'priority': return this.priorities.map(p => { return { code: p.code + '', value: p.value } });
      case 'state': return this.states.map(p => { return { code: p.code, value: p.value } });
      case 'profileName': return this.profiles.map(p => { return { code: p.name + '', value: p.title } });
      case 'ownerId': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'taskName': return this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
      case 'taskUser': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'model': return this.config.allModels.map((p: string) => { return { code: p, value: this.translator.getTranslation('model.' + p) } });
      default: return [];
    }
  }

  listValue(field: string, code: string) {
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
      this.filterFields[c] = '';
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }

    });
    this.setColumnsWith();
  }

  setSelectedColumnsSubJobs() {

    this.workFlowColumnsSubJobs = this.columnsWorkFlowSubJobs.filter(c => c.selected).map(c => c.field);

    this.workFlowColumnsSubJobs.forEach(c => {
      if (this.columnType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }

    });
    this.setColumnsWithSubJobs();
  }

  setColumnsWith() {
    this.colsWidth = {};
    this.columnsWorkFlow.forEach((c: any) => {
      this.colsWidth[c.field] = c.width + 'px';
    });
  }

  setColumnsWithSubJobs() {
    this.colsWidthSubJobs = {};
    this.columnsWorkFlowSubJobs.forEach((c: any) => {
      this.colsWidthSubJobs[c.field] = c.width + 'px';
    });
  }

  saveColumnsSizes(e: any, field?: string) {
    this.colsWidth[field] = e + 'px';
    this.properties.setColumnsWorkFlow(this.columnsWorkFlow);
  }

  saveColumnsSizesSubJobs(e: any, field?: string) {
    this.colsWidthSubJobs[field] = e + 'px';
    this.properties.setColumnsWorkFlowSubJobs(this.columnsWorkFlowSubJobs);
  }

  removeJob() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.removeJob.title')),
      message: String(this.translator.instant('dialog.removeJob.message')),
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
        this.api.removeWorkflow(this.selectedJob.id).subscribe(res => {
          this.getWorkflow();
        })
      }
    });
  }

}
