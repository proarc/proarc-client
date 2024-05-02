import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';

// -- table to expand --
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Sort, SortDirection } from '@angular/material/sort';
import { User } from 'src/app/model/user.model';
// -- table to expand --

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
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
export class TaskComponent implements OnInit {



  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'name'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --


  tasks: any[];
  tasksColumns = ['profileLabel', 'state', 'ownerName', 'barcode'];
  filterTasksColumns: string[] = [];
  tasksSortField: string = 'created';
  tasksSortDir: SortDirection = 'desc';

  id: number;
  task: any;
  parameters: any;
  material: any;

  scanners: { code: string, value: string }[] = [];
  scanner: any;
  imageColors: { code: string, value: string }[] = [];
  imageColor: any;
  dpis: { code: string, value: string }[] = [];
  dpi: any;

  profileNames: {disabled: boolean, hint: string, name: string, title: string}[] = [];
  profileNameFilter: string;
  states: string[] = [];
  stateFilter: string = '';

  ownerNameFilter: string;
  users: User[];
  barcodeFilter: string;

  filters: {field: string, value: string}[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    private api: ApiService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    this.tasksColumns.forEach(c => {
      this.filterTasksColumns.push(c + '-filter');
    });
    this.route.paramMap.subscribe(
      p => {
        this.id = parseInt(p.get('id'));
        this.initData();
      });
  }

  initData() {
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
    if (this.config.valueMap) {
      this.scanners = this.config.getValueMap('wf.valuemap.scannerNow');
      this.imageColors = this.config.getValueMap('wf.valuemap.imageColor');
      this.dpis = this.config.getValueMap('wf.valuemap.dpi');
      this.profileNames = this.config.getValueMap('proarc.workflow.tasks');
      this.layout.ready = true;
      if (this.id) {
        this.loadTask(this.id);
      } else {
        this.getTasks();
      }
    } else {
      setTimeout(() => {
        this.initData();
      }, 100);
    }
  }

  loadTask(id: number) {
    this.getTask(id);
  }

  selectTask(task: any) {
    this.task = task;
    // this.id = task.id;
    this.loadTask(task.id);
  }

  getValueMap(field: string) {

    // imageColor v  obcas vraci code a obcas value !!
    // const ic = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.imageColor');
    // if (ic) {
    //   this.imageColor = this.imageColors.find(c => c.value === ic.value || c.code === ic.value).code;
    // }


    return this.config.getValueMap(field);
  }

  getTasks() {
    let params = '?';
    if (this.tasksSortDir) {
      params += '_sortBy=' + (this.tasksSortDir === 'desc' ? '-' : '') + this.tasksSortField;
    }

    this.filters.forEach(f => {
      if (f.value !== '') {
        params += `&${f.field}=${f.value}`;
      }
    });


    this.api.getWorkflowTasks(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.tasks = response.response.data;

      
      this.tasks.forEach(b => {
        if (!this.states.includes(b.state)) {
          this.states.push(b.state)
        }
        // if (!this.profiles.includes(b.profileLabel)) {
        //   this.profiles.push(b.profileLabel)
        // }
      })


      this.selectTask(this.tasks[0]);

    });
  }

  // getJob() {
  //   this.router.navigate()
  // }


  getTask(id: number) {
    this.api.getWorkflowTask(id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.task = response.response.data[0];
      if (this.id) {
        this.tasks = response.response.data;
      }
      this.getParameters();
      this.getMaterial();
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
    this.api.getWorkflowTaskParameters(this.task.id).subscribe((response: any) => {
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
    this.api.getWorkflowTaskMaterial(this.task.id).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.material = response.response.data;
    });
  }

  sortTasksTable(e: Sort) {
    if (this.id) {
      return;
    }
    this.tasksSortDir = e.direction;
    this.tasksSortField = e.active;    
    this.getTasks();
  }

  filter(field: string, value: string) {
    const f = this.filters.find(f => f.field === field);
    if (f) {
      f.value = value;
    } else {
      this.filters.push({field, value});
    }
    this.getTasks();
  }

}
