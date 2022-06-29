import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { transformGeometryWithOptions } from 'ol/format/Feature';
import { Workflow } from 'src/app/model/workflow.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  profiles: any[];
  selectedProfile: any;

  workFlowColumns = ['taskUsername', 'label'];
  items: Workflow[];
  selectedItem: Workflow;

  material: any[];
  tasks: any[];

  constructor(
    private translator: TranslateService,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService) { }

  ngOnInit(): void {
    this.getWorkflowProfiles();
  }

  getWorkflowProfiles() {
    this.api.getWorkflowProfiles().subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
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
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        return;
      }
      this.items = response.response.data;
      this.selectItem(this.items[0]);
    });
  }

  getMaterial(id: number) {
    this.api.getWorkflowMaterial(id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        return;
      }
      this.material = response.response.data;
    });
  }

  getTask(id: number) {
    this.api.getWorkflowTask(id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;
    });
  }

  getItem(id: number) {
    this.api.getWorkflowItem(id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        return;
      }
      this.selectedItem = response.response.data[0];
    });
  }

  selectItem(w: Workflow) {
    this.selectedItem = w;
    this.selectedProfile = this.profiles.find(p => p.name === w.profileName);
    this.tasks = this.selectedProfile.task;
    this.getMaterial(this.selectedItem.id);
    // this.getItem(this.selectedItem.id)
  }

}
