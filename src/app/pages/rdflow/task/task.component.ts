import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  id: number;
  task: any; 
  parameters: any;
  material: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private ui: UIService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      p => {
        this.id = parseInt(p.get('id'));
        if (this.id) {
          this.getTask();
          this.getParameters();
          this.getMaterial();
        }
      });
  }

  getTask() {
    this.api.getWorkflowTask(this.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.task = response.response.data[0];
    });
  }

  getParameters() {
    this.api.getWorkflowTaskParameters(this.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.parameters = response.response.data;
    });
  }

  getMaterial() {
    this.api.getWorkflowTaskMaterial(this.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.material = response.response.data;
    });
  }

}
