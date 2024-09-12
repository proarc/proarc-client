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
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { WorkFlowProfile } from 'src/app/model/workflow.model';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ColumnsSettingsDialogComponent } from 'src/app/dialogs/columns-settings-dialog/columns-settings-dialog.component';
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

  profiles: WorkFlowProfile[];
  allTasks: any[];

  tasks: any[];

  columnsTasks: { field: string, selected: boolean, type: string }[];
  colsWidthTasks: { [key: string]: number } = {};


  selectedColumns: string[] = [];
  filterTasksColumns: string[] = [];
  tasksSortField: string = 'created';
  tasksSortDir: SortDirection = 'desc';

  
  // colsWidth: { [key: string]: number } = {};
  columnTypes: {[field: string]: string} = {};
  filters: { [field: string]: string } = {};
  // filters: { field: string, value: string }[] = [];
  filterFields: { [field: string]: string } = {};
  lists: { [field: string]: { code: string, value: string }[] } = {};

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

  onlyMyTasks: boolean;


  startShiftClickIdx: number;
  lastClickIdx: number;
  totalSelected: number;
  isSelectionSameType: boolean;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private translator: TranslateService,
    private route: ActivatedRoute,
    private config: ConfigService,
    public properties: LocalStorageService,
    private api: ApiService,
    public auth: AuthService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    this.allTasks = this.config.getValueMap('proarc.workflow.tasks');
    this.columnsTasks = this.properties.getColumnsWorkFlowTasks();
    // this.tasksColumns.forEach(c => {
    //   this.filterTasksColumns.push(c + '-filter');
    // });
    if (this.route.snapshot.url[0].path === 'my_tasks') {
      this.onlyMyTasks = true;
    }
    this.route.paramMap.subscribe(
      p => {
        this.id = parseInt(p.get('id'));
        this.getWorkflowProfiles();
      });
  }

  getWorkflowProfiles() {
    const rUsers = this.api.getUsers();
    const rProfiles = this.api.getWorkflowProfiles();
    forkJoin([rUsers, rProfiles]).subscribe(([users, profiles]: [User[], any]) => {
      this.users = users;
    // this.api.getWorkflowProfiles().subscribe((profiles: any) => {
      if (profiles['response'].errors) {
        this.ui.showErrorDialogFromObject(profiles['response'].errors);
        return;
      }
      this.profiles = profiles.response.data;
      this.setSelectedColumnsTasks();
      this.initData();
    });
  }

  setSelectedColumnsTasks() {
    this.filterTasksColumns = [];
    this.selectedColumns = this.columnsTasks.filter(c => c.selected).map(c => c.field);
    
    this.selectedColumns.forEach(c => {
      this.filterTasksColumns.push(c + '-filter');
    });

    this.selectedColumns.forEach(c => {
      if (this.columnTasksType(c) === 'list') {
        this.lists[c] = this.getList(c);
      }
      this.columnTypes[c] = this.columnTasksType(c);
    });

    this.setColumnsWidthTasks();
  }

  setColumnsWidthTasks() {
    this.colsWidthTasks = {};
    this.columnsTasks.forEach((c: any) => {
      this.colsWidthTasks[c.field] = c.width;
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

    const keys: string[] = Object.keys(this.filters);
    keys.forEach((k: string) => {
      if (this.filters[k] !== '') {
        params += `&${k}=${this.filters[k]}`;
      }
    });

    // this.filters.forEach(f => {
    //   if (f.value !== '') {
    //     params += `&${f.field}=${f.value}`;
    //   }
    // });


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


        this.tasks.forEach(i => i.selected = false);
        this.task.selected = true;
        this.startShiftClickIdx = 0;
      

        this.lastClickIdx = 0;
        this.totalSelected = 1;
        this.isSelectionSameType = true;

        // this.taskClick(this.tasks[0], null, 0)
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
        const icv  = this.imageColors.find(c => c.value === ic.value || c.code === ic.value);
        if (icv) {
          this.imageColor = icv.value;
        }
        
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
    this.filters[field] = value;
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

  saveColumnsSizes(e: any, field?: string) {
    this.colsWidthTasks[field] = e;
    this.columnsTasks.forEach((c: any) => {
      c.width = this.colsWidthTasks[c.field];
    });
  
    this.properties.setColumnsWorkFlowTasks(this.columnsTasks);
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

  columnTasksType(f: string) {
    return this.columnsTasks.find(c => c.field === f).type;
  }

  getList(f: string): { code: string, value: string }[] {
    switch (f) {
      case 'priority': return this.priorities.map(p => { return { code: p.code + '', value: p.value } });
      case 'state': return this.states.map(p => { return { code: p, value: p } });
      case 'profileName': return this.profiles.map(p => { return { code: p.name + '', value: p.title } });
      case 'ownerId': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'taskName': return this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
      case 'taskUser': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'model': return this.config.allModels.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
      default: return [];
    }
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
          case 'tasks':
          this.columnsTasks = this.properties.getColumnsWorkFlowTasks();
          this.setSelectedColumnsTasks();
          break;
          default:

        }

      }
    });
  }

}
