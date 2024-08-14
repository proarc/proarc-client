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
import { AuthService } from 'src/app/services/auth.service';
import { TaskssEditDialogComponent } from '../tasks-edit-dialog/tasks-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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

  statesAll = [
    { code: 'READY', value: 'Připraven' },
    { code: 'STARTED', value: 'Probíhá' },
    { code: 'FINISHED', value: 'Dokončen' },
    { code: 'CANCELED', value: 'Zrušen' },
  ]

  priorities = [
    { code: 1, value: 'Spěchá' },
    { code: 2, value: 'Normální' },
    { code: 3, value: 'Nízká' },
    { code: 4, value: 'Odloženo' },
  ]

  profileNames: { disabled: boolean, hint: string, name: string, title: string }[] = [];
  profileNameFilter: string;
  states: string[] = [];
  stateFilter: string = '';

  ownerNameFilter: string;
  users: User[];
  barcodeFilter: string;

  filters: { field: string, value: string }[] = [];
  onlyMyTasks: boolean;


  startShiftClickIdx: number;
  lastClickIdx: number;
  totalSelected: number;
  isSelectionSameType: boolean;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private config: ConfigService,
    private api: ApiService,
    public auth: AuthService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    this.tasksColumns.forEach(c => {
      this.filterTasksColumns.push(c + '-filter');
    });
    if (this.route.snapshot.url[0].path === 'my_tasks') {
      this.onlyMyTasks = true;
    }
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

    // imageColor obcas vraci code a obcas value !!
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

    if (this.onlyMyTasks) {
      params += '&state=READY&ownerId=' + this.auth.getUserId();
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
        this.taskClick(this.tasks[0], null, 0)
      }
      this.getParameters();
      this.getMaterial();
    });
  }

  saveTask() {
    const params: any = {};
    this.parameters.forEach((p: any) => {
      params[p.profileName] = p.value;
    })
    this.task.params = params;
    this.api.saveWorkflowTask(this.task).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.task = response.response.data[0];
      if (this.id) {
        this.tasks = response.response.data;
      }
    });

  }

  saveTasks() {

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

      // imageColor obcas vraci code a obcas value !!
      const ic = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.imageColor');
      if (ic) {
        this.imageColor = this.imageColors.find(c => c.value === ic.value || c.code === ic.value).value;
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
      this.filters.push({ field, value });
    }
    this.getTasks();
  }

  taskClick(item: any, event?: MouseEvent, idx?: number) {
    if (event && (event.metaKey || event.ctrlKey)) {
      item.selected = !item.selected;
      this.startShiftClickIdx = idx;
    } else if (event && event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.tasks[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, idx);
        const to = Math.max(this.startShiftClickIdx, idx);
        for (let i = from; i <= to; i++) {
          this.tasks[i].selected = true;
        }
      } else {
        // nic neni.
        this.tasks.forEach(i => i.selected = false);
        item.selected = true;
        this.startShiftClickIdx = idx;
      }
    } else {
      this.tasks.forEach(i => i.selected = false);
      item.selected = true;
      this.startShiftClickIdx = idx;
    }

    this.lastClickIdx = idx;
    this.totalSelected = this.tasks.filter(i => i.selected).length;
    this.isSelectionSameType = true;
    if (this.totalSelected > 1) {
      
      let profileLabel = item.profileLabel;
      this.tasks.filter(i => i.selected).forEach(i => {
        if (i.profileLabel !== profileLabel) {
          this.isSelectionSameType = false;
        }
      })
    }


    if (this.totalSelected > 0) {
      this.selectTask(item);
    }
  }

  editTasks() {
    const dialogRef = this.dialog.open(TaskssEditDialogComponent, {
      // disableClose: true,
      height: '60%',
      width: '680px',
      data: {
        states: this.statesAll,
        priorities: this.priorities,
        users: this.users,
        parameters: this.parameters,
        tasks: this.tasks.filter(i => i.selected)
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getTasks();
      }
    });
  }

}
