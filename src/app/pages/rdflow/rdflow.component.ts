import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { transformGeometryWithOptions } from 'ol/format/Feature';
import { RDFlow } from 'src/app/model/rdflow.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { NewWorkflowDialogComponent } from './new-workflow-dialog/new-workflow-dialog.component';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { LayoutAdminComponent } from 'src/app/dialogs/layout-admin/layout-admin.component';

@Component({
  selector: 'app-rdflow',
  templateUrl: './rdflow.component.html',
  styleUrls: ['./rdflow.component.scss']
})
export class RDFlowComponent implements OnInit {

  profiles: any[];
  selectedProfile: any;

  workFlowColumns = ['taskUsername', 'label'];
  items: RDFlow[];
  selectedItem: RDFlow;

  material: any[];
  taskColumns = ['label', 'user', 'state'];
  tasks: any[];

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
    this.items = [];
    this.api.getWorkflow().subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.items = response.response.data;
      this.selectItem(this.items[0]);
      this.layout.ready = true;
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
    this.api.saveWorkflowItem(this.selectedItem).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;
    });
    
  }

  getDetail() {
    this.api.getWorkflowItem(this.selectedItem.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.selectedItem = response.response.data[0];
    });
  }

  selectItem(w: RDFlow) {
    this.selectedItem = w;
    this.selectedProfile = this.profiles.find(p => p.name === w.profileName);
    //this.tasks = this.selectedProfile.task;
    this.getMaterial(this.selectedItem.id);
    this.getTasks(this.selectedItem.id);
    // this.getItem(this.selectedItem.id)
  }

  createWorkflow() {
    const dialogRef = this.dialog.open(NewWorkflowDialogComponent, {data: {profiles: this.profiles}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.getWorkflow();
      }
    });
  }

  openTask(id: string) {
    console.log(id)
    this.router.navigate(['rdflow/task', id])
  }

}
