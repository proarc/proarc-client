import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { transformGeometryWithOptions } from 'ol/format/Feature';
import { RDFlow, RDFlowMaterial, RDFlowProfile, RDFlowProfileSubjob } from 'src/app/model/rdflow.model';
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
// -- table to expand --

@Component({
  selector: 'app-rdflow',
  templateUrl: './rdflow.component.html',
  styleUrls: ['./rdflow.component.scss'],
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

export class RDFlowComponent implements OnInit {

  columnsRDFlow: { field: string, selected: boolean, type: string }[];
  colsWidth: { [key: string]: string } = {};

  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'note'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --


  profiles: RDFlowProfile[];
  selectedProfile: RDFlowProfile;

  workFlowColumns = ['taskUsername', 'label', 'profileName'];
  filterWorkFlowColumns: string[] = [];

  allJobs: RDFlow[] = [];
  jobs: RDFlow[] = [];
  subJobs: RDFlow[] = [];
  selectedJob: RDFlow;
  hasObject: boolean;

  jobsSortField: string = 'created';
  jobsSortDir: SortDirection = 'desc';
  subjobsSortField: string = 'created';
  subjobsSortDir: SortDirection = 'desc';


  materials: RDFlowMaterial[];
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
  filters: { field: string, value: string }[] = [];
  taskUsernameFilter: string;
  labelFilter: string;
  profileNameFilter: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public properties: LocalStorageService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(
    //   p => {
    //     this.id = parseInt(p.get('id'));
    //     this.initData();
    //   });

    this.columnsRDFlow = this.properties.getColumnsRDFlow();
    this.setSelectedColumns();


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
      this.getWorkflow();

    });
  }

  getWorkflow() {
    this.jobs = [];
    this.subJobs = [];
    let params = '?';
    if (this.jobsSortDir) {
      params += '_sortBy=' + (this.jobsSortDir === 'desc' ? '-' : '') + this.jobsSortField;
    }
    this.filters.forEach(f => {
      if (f.value !== '') {
        params += `&${f.field}=${f.value}`;
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

  selectJob(w: RDFlow) {
    if (w.id === this.selectedJob?.id) {
      return;
    }
    this.selectedJob = w;
    this.selectedProfile = this.profiles.find(p => p.name === w.profileName);
    //this.tasks = this.selectedProfile.task;
    this.getMaterial();
    this.getTasks();
    this.getSubJobs();
    // this.getItem(this.selectedItem.id)
  }

  createJob() {
    const dialogRef = this.dialog.open(NewJobDialogComponent, {
      data: { profiles: this.profiles },
      width: '800px',
      panelClass: 'app-dialog-new-job'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.getWorkflow();
      }
    });
  }

  createSubJob(profile: RDFlowProfileSubjob) {

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
    this.router.navigate(['rdflow/task', id])
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
    const f = this.filters.find(f => f.field === field);
    if (f) {
      f.value = value;
    } else {
      this.filters.push({ field, value });
    }
    this.getWorkflow();
  }

  selectColumns() {
    const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
      data: {
        isRepo: false,
        isRDFlow: true
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columnsRDFlow = this.properties.getColumnsRDFlow();
      }
    });
  }

  columnType(f: string) {
    return this.columnsRDFlow.find(c => c.field === f).type;
  }

  setSelectedColumns() {


    this.workFlowColumns = [];

    this.workFlowColumns = this.columnsRDFlow.filter(c => c.selected && !this.workFlowColumns.includes(c.field)).map(c => c.field);


    this.workFlowColumns.forEach(c => {
      this.filterWorkFlowColumns.push(c + '-filter');
    });
    this.setColumnsWith();
  }

  setColumnsWith() {
    this.colsWidth = {};

    this.columnsRDFlow.forEach((c: any) => {
      this.colsWidth[c.field] = c.width + 'px';
    });
  }

  saveColumnsSizes(e: any, field?: string) {
    // console.log(e, field)
    this.colsWidth[field] = e + 'px';
    this.properties.setColumnsRDFlow(this.columnsRDFlow);
  }

}
