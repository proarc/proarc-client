import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';

// -- table to expand --
import {animate, state, style, transition, trigger} from '@angular/animations';
// -- table to expand --

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
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
export class TaskComponent implements OnInit {

  

  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'name'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --

  id: number;
  task: any;
  parameters: any;
  material: any;

  scanners: {code: string, value: string}[] = [];
  scanner: any;
  imageColors: {code: string, value: string}[] = [];
  imageColor: any;
  dpis: {code: string, value: string}[] = [];
  dpi: any;

  constructor(
    private route: ActivatedRoute,
    private config: ConfigService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      p => {
        this.id = parseInt(p.get('id'));
        if (this.id) {
          this.initData();
        }

      });
  }

  initData() {
    if (this.config.valueMap) {
      this.getTask();
      this.getParameters();
      this.getMaterial();
      this.scanners = this.config.getValueMap('wf.valuemap.scannerNow');
      this.imageColors = this.config.getValueMap('wf.valuemap.imageColor');
      this.dpis = this.config.getValueMap('wf.valuemap.dpi');
      this.layout.ready = true;
    } else {
      setTimeout(() => {
        this.initData();
      }, 100);
    }
  }

  getValueMap(field: string) {

    // imageColor v  obcas vraci code a obcas value !!
    // const ic = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.imageColor');
    // if (ic) {
    //   this.imageColor = this.imageColors.find(c => c.value === ic.value || c.code === ic.value).code;
    // }


    return this.config.getValueMap(field);
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

  saveTask() {
    this.api.saveWorkflowTask(this.task).subscribe((response: any) => {
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
      this.scanner = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.scannerNow')?.value;
      this.dpi = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.dpi')?.value;

      // imageColor v  obcas vraci code a obcas value !!
      const ic = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.imageColor');
      if (ic) {
        this.imageColor = this.imageColors.find(c => c.value === ic.value || c.code === ic.value).code;
      }
      
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
