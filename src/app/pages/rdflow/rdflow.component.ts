import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { transformGeometryWithOptions } from 'ol/format/Feature';
import { RDFlow } from 'src/app/model/rdflow.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { NewJobDialogComponent } from './new-job-dialog/new-job-dialog.component';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { LayoutAdminComponent } from 'src/app/dialogs/layout-admin/layout-admin.component';

// -- table to expand --
import {animate, state, style, transition, trigger} from '@angular/animations';
// -- table to expand --

@Component({
  selector: 'app-rdflow',
  templateUrl: './rdflow.component.html',
  styleUrls: ['./rdflow.component.scss'],
  // -- table to expand --
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  // -- table to expand --
})

export class RDFlowComponent implements OnInit {

  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'name'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --


  profiles: any[];
  selectedProfile: any;

  workFlowColumns = ['taskUsername', 'label'];
  jobs: RDFlow[] = [];
  subJobs: RDFlow[] = [];
  selectedJob: RDFlow;


  material: any[];
  taskColumns = ['label', 'user', 'state'];
  tasks: any[];

  states = [
    {code: 'OPEN', value: 'Otevřený'},
    {code: 'FINISHED', value: 'Hotový'},
    {code: 'CANCELED', value: 'Zrušený'},
  ]

  priorities = [
    {code: 1, value: 'Spěchá'},
    {code: 2, value: 'Normální'},
    {code: 3, value: 'Nízká'},
    {code: 4, value: 'Odloženo'},
  ]

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService) { }

  ngOnInit(): void {
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
    this.api.getWorkflow().subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.jobs = response.response.data;
      this.selectJob(this.jobs[0]);
      this.layout.ready = true;
    });
  }

  

  getSubJobs(id: number) {
    this.subJobs = [];
    this.api.getWorkflowSubJobs(id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.subJobs = response.response.data;
    });
  }

  getMaterial(id: number) {
    this.api.getWorkflowMaterial(id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.material = response.response.data;
    });
  }

  getTasks(id: number) {
    this.api.getWorkflowTasks(id).subscribe((response: any) => {
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
    this.selectedJob = w;
    this.selectedProfile = this.profiles.find(p => p.name === w.profileName);
    //this.tasks = this.selectedProfile.task;
    this.getMaterial(this.selectedJob.id);
    this.getTasks(this.selectedJob.id);
    this.getSubJobs(this.selectedJob.id);
    // this.getItem(this.selectedItem.id)
  }

  createJob() {
    const dialogRef = this.dialog.open(NewJobDialogComponent, {
      data: {profiles: this.profiles},
      width: '800px',
      panelClass: 'app-dialog-new-job'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.getWorkflow();
      }
    });
  }

  createSubJob(profile: string) {

  }

  createNewObject(profile: string) {
    
  }

  openTask(id: string) {
    this.router.navigate(['rdflow/task', id])
  }

}
