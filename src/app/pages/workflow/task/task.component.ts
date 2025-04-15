import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// -- table to expand --
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { TaskssEditDialogComponent } from '../tasks-edit-dialog/tasks-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';
import { UserTableComponent } from '../../../components/user-table/user-table.component';
import { ColumnsSettingsDialogComponent } from '../../../dialogs/columns-settings-dialog/columns-settings-dialog.component';
import { User } from '../../../model/user.model';
import { WorkFlowProfile } from '../../../model/workflow.model';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout-service';
import { UIService } from '../../../services/ui.service';
import { MaterialEditComponent } from '../material-edit/material-edit.component';
import { Configuration } from '../../../shared/configuration';
// -- table to expand --

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule,
    MatTableModule, MatSortModule, UserTableComponent, MaterialEditComponent],
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

  loading: boolean;

  // -- table to expand --
  materialColumnsToDisplay = ['profileLabel', 'label', 'name'];
  materialColumnsToDisplayWithExpand = [...this.materialColumnsToDisplay, 'expand'];
  materialExpandedElement: any[];
  // -- table to expand --

  profiles: WorkFlowProfile[];
  // allTasks: any[];

  tasks: any[] = [];

  columnsTasks: { field: string, selected: boolean, type: string }[];
  colsWidthTasks: { [key: string]: number } = {};


  filterTasksColumns: string[] = [];
  // tasksSortField: string = 'created';
  // tasksSortDir: SortDirection = 'desc';

  workflowTasksSort: {active: string, direction: SortDirection} = {active: 'created', direction: 'desc'} ;
  workflowTasksFilters: { [field: string]: string } = {};


  columnTypes: { [field: string]: string } = {};
  // filters: { [field: string]: string } = {};
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

  // states: string[] = [];
  states = [
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
    private config: Configuration,
    private api: ApiService,
    public auth: AuthService,
    private ui: UIService,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    this.profileNames = this.config.getValueMap('proarc.workflow.tasks');
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
      this.loading = false;
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
    if (task) {
      this.loadTask(task.id);
    }
    
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
    if (this.workflowTasksSort.direction) {
      params += '_sortBy=' + (this.workflowTasksSort.direction === 'desc' ? '-' : '') + this.workflowTasksSort.active;
    }

    if (this.onlyMyTasks) {
      params += '&ownerId=' + this.auth.getUserId();
      // params += '&state=READY&ownerId=' + this.auth.getUserId();
    }

    const keys: string[] = Object.keys(this.workflowTasksFilters);
    keys.forEach((k: string) => {
      if (this.workflowTasksFilters[k] !== '') {
        params += `&${k}=${this.workflowTasksFilters[k]}`;
      }
    });


    this.api.getWorkflowTasks(params).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
        this.tasks = response.response.data;
      // response.response.data.forEach((b: any) => {
      //   if (!this.states.includes(b.state)) {
      //     this.states.push(b.state)
      //   }
      // });
      // this.lists['state'] = this.states.map(p => { return { code: p, value: p } });

      if (this.tasks.length > 0) {
        this.selectTask(this.tasks[0]);
      } else {
        this.selectTask(null);
        this.totalSelected = 0;
      }
      

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
    let hasError = false;
    this.parameters.forEach((p: any) => {
      if (p.required && !p.value) {
        this.ui.showErrorSnackBar(this.translator.instant('workflow.missing_required_field') + ' ' + p.profileLabel);
        document.getElementById('param_' + p.profileName).focus();
        hasError = true;
      }
      params[p.profileName] = p.value;
    });
    if (hasError) {
      return;
    }
    this.task.params = params;
    this.api.saveWorkflowTask(this.task).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      if (this.task.state === 'FINISHED') {
        this.router.navigate(['/workflow/jobs', this.task.jobId]);
      } else {
        this.task = response.response.data[0];
        if (this.id) {
          this.tasks = response.response.data;
        }
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
        const icv = this.imageColors.find(c => c.value === ic.value || c.code === ic.value);
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
    this.workflowTasksSort = {active: e.active, direction: e.direction};
    this.getTasks();
  }

  filter(field: string, value: string) {
    this.workflowTasksFilters[field] = value;
    this.getTasks();
  }

  taskClick(e: {item: any, event?: MouseEvent, idx?: number}) {
    if (e.event && (e.event.metaKey || e.event.ctrlKey)) {
      e.item.selected = !e.item.selected;
      this.startShiftClickIdx = e.idx;
    } else if (e.event && e.event.shiftKey) {
      if (this.startShiftClickIdx > -1) {
        const oldFrom = Math.min(this.startShiftClickIdx, this.lastClickIdx);
        const oldTo = Math.max(this.startShiftClickIdx, this.lastClickIdx);
        for (let i = oldFrom; i <= oldTo; i++) {
          this.tasks[i].selected = false;
        }
        const from = Math.min(this.startShiftClickIdx, e.idx);
        const to = Math.max(this.startShiftClickIdx, e.idx);
        for (let i = from; i <= to; i++) {
          this.tasks[i].selected = true;
        }
      } else {
        // nic neni.
        this.tasks.forEach(i => i.selected = false);
        e.item.selected = true;
        this.startShiftClickIdx = e.idx;
      }
    } else {
      this.tasks.forEach(i => i.selected = false);
      e.item.selected = true;
      this.startShiftClickIdx = e.idx;
    }

    this.lastClickIdx = e.idx;
    this.totalSelected = this.tasks.filter(i => i.selected).length;
    this.isSelectionSameType = true;
    if (this.totalSelected > 1) {

      let profileLabel = e.item.profileLabel;
      this.tasks.filter(i => i.selected).forEach(i => {
        if (i.profileLabel !== profileLabel) {
          this.isSelectionSameType = false;
        }
      })
    }


    if (this.totalSelected > 0) {
      this.selectTask(e.item);
    }
  }

  editTasks() {
    const dialogRef = this.dialog.open(TaskssEditDialogComponent, {
      // disableClose: true,
      height: '60%',
      width: '680px',
      data: {
        states: this.states,
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

  // saveColumnsSizes(e: any, field?: string) {
  //   this.colsWidthTasks[field] = e;
  //   this.columnsTasks.forEach((c: any) => {
  //     c.width = this.colsWidthTasks[c.field];
  //   });

  //   this.properties.setColumnsWorkFlowTasks(this.columnsTasks);
  // }


  listValue(field: string, code: string) {
    const el = this.lists[field].find(el => el.code === code + '');
    return el ? el.value : code;
  }

  translatedField(f: string): string {
    switch (f) {
      case 'taskName': return 'taskLabel'
      case 'profilekName': return 'profileLabel'
      default: return f
    }
  }

  columnTasksType(f: string) {
    return this.columnsTasks.find(c => c.field === f).type;
  }

  getList(f: string): { code: string, value: string }[] {
    console.log(f)
    switch (f) {
      case 'priority': return this.priorities.map(p => { return { code: p.code + '', value: p.value } });
      case 'state': return this.states.map(p => { return { code: p.code, value: p.value } });
      case 'profileName': {
        console.log(this.profileNames)
        return this.profileNames.map(p => { return { code: p.name + '', value: p.title } });
      }
      // case 'profileLabel': return this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
      case 'ownerId': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      // case 'taskName': return this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
      case 'taskUser': return this.users.map(p => { return { code: p.userId + '', value: p.name } });
      case 'model': return this.config.models.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
      default: return [];
    }
  }

  // selectColumns(type: string) {
  //   const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
  //     data: {
  //       type: type,
  //       isRepo: false,
  //       isImport: false,
  //       isWorkFlow: type === 'jobs',
  //       isWorkFlowSubJobs: type === 'subjobs',
  //       isWorkFlowTasks: type === 'tasks'
  //     },
  //     width: '600px',
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       switch (type) {
  //         case 'tasks':
  //           this.columnsTasks = this.properties.getColumnsWorkFlowTasks();
  //           this.setSelectedColumnsTasks();
  //           break;
  //         default:

  //       }

  //     }
  //   });
  // }

}
