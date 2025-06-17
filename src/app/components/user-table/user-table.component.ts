import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, input, output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ResizecolDirective } from '../../resizecol.directive';
import { UIService } from '../../services/ui.service';
import { Configuration, TableColumn } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Utils } from '../../utils/utils';
import { LayoutService } from '../../services/layout-service';


import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ColumnsSettingsDialogComponent } from '../../dialogs/columns-settings-dialog/columns-settings-dialog.component';
import { TableItem } from '../../model/table-item.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-table',
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule,
    MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule,
    CdkDropList, CdkDrag, MatMenuModule, MatPaginatorModule,
    MatTableModule, MatSortModule, ResizecolDirective],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {

  @ViewChild('table', { static: true }) table: MatTable<TableItem>;
  @ViewChildren('matrow', { read: ViewContainerRef }) rows: QueryList<ViewContainerRef>;

  colsSettingsName = input<string>();
  withFilters = input<boolean>();
  actions = input<any[]>([]);
  items = input<any[]>();
  sortField: string;
  sortAsc: boolean;

  sortBy = output<Sort>();
  selectItem = output<{ item: any, event: MouseEvent, idx: number }>();
  openItem = output<any>();
  getValidationError = output<string>();
  onFilter = output<{ field: string, value: string }>();
  onColumnLink = output<{ field: string, value: string }>();

  draggable = input<boolean>();
  mousedown = output<any>();
  dragenter = output<{ e: any, idx: number }>();
  dragstart = output<{ item: TableItem, e: MouseEvent, idx: number }>();
  dragover = output<any>();
  dragend = output<any>();

  selectedColumns: TableColumn[];
  displayedColumns: string[];

  filterColumns: string[] = [];
  filterFields: { [field: string]: string } = {};
  existingFilters = input<{ [field: string]: string }>({});

  prefixes: { [field: string]: string } = {};
  lists: { [field: string]: { code: string, value: string }[] } = {};
  statuses = [
    "undefined",
    "new",
    "assign",
    "connected",
    "processing",
    "described",
    "exported"]

  constructor(
    private translator: TranslateService,
    private dialog: MatDialog,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    public config: Configuration,
    public ui: UIService,
    private layout: LayoutService) {
    effect(() => {
      this.initColumns(this.colsSettingsName());
      this.scrollToLastClicked(this.layout.lastSelectedItem());

    })
    effect(() => {
      // this.items() = this.items();
      //   console.log(this.items())
      // if (this.items()) {
      //   this.table.renderRows();
      // } else {
      //   this.items() = [];
      // }

    })
  }

  initColumns(colsSettingsName: string) {
    if (colsSettingsName === 'colsEditingRepo') {
      const models: string[] = [];
      this.items().forEach(i => {
        if (!models.includes(i.model)) {
          models.push(i.model);
        }
      });
      this.displayedColumns = [];
      if (this.settings.colsEditModeParent && this.layout.selectedParentItem?.model) {
        this.selectedColumns = this.settings.colsEditingRepo[this.layout.selectedParentItem.model].filter(c => c.selected && !this.displayedColumns.includes(c.field));

      } else {
        this.selectedColumns = [];
        models.forEach(model => {
          const f = this.settings.colsEditingRepo[model].filter(c => c.selected && !this.displayedColumns.includes(c.field));
          this.selectedColumns.push(...f);
        });
      }
    } else {
      const colsSettings: TableColumn[] = Utils.clone(this.settings[colsSettingsName]);
      this.selectedColumns = colsSettings.filter(c => c.selected);
    }

    this.displayedColumns = this.selectedColumns.map(c => c.field);
    this.selectedColumns.forEach(c => {
      if (c.type === 'list') {
        this.lists[c.field] = this.getList(c.field);
      }
      this.prefixes[c.field] = this.prefixByType(c.field);

      if (this.withFilters()) {
        this.filterColumns.push(c.field + '-filter');
        this.filterFields[c.field] = this.existingFilters()[c.field];
      }
    });
  }

  setColumns() {
    const model = this.layout.selectedParentItem ? this.layout.selectedParentItem.model : this.items()[0].model
    const dialogRef = this.dialog.open(ColumnsSettingsDialogComponent, {
      data: {
        colsSettingsName: this.colsSettingsName(),
        model: model,
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initColumns(this.colsSettingsName());
      }
    });
  }

  scrollToLastClicked(item: TableItem) {
    // const index = this.layout.lastItemIdxClicked;
    // if (index < 0) {
    //   return;
    // }
    if (!this.rows) {
      return;
    }
    if (!item) {
      return
    }
    let row = this.rows.find(tr => tr.element.nativeElement.id === 'tr_' + item.pid);
    if (row) {
      setTimeout(() => {
        row.element.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }

  listValue(field: string, code: string) {
    const el = this.lists[field].find(el => el.code === code + '');
    return el ? el.value : code;
  }

  getList(f: string): { code: string, value: string }[] {
    switch (f) {
      case 'status': return this.statuses.map((p: string) => { return { code: p, value: this.translator.instant('editor.atm.statuses.' + p) } });
      case 'model': return this.config.models.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
      default: return [];
    }
  }

  saveColumnsSizes(e: any, field?: string) {
    console.log(this.colsSettingsName())
    if (this.colsSettingsName() === 'colsEditingRepo') {
      const model = this.settings.colsEditModeParent ? this.layout.selectedParentItem?.model : this.items()[0].model;
      const el = this.settings.colsEditingRepo[model].find((c: any) => c.field === field);
      if (el) {
        el.width = e;
      }
    } else {
      const el = this.settings[this.colsSettingsName()].find((c: any) => c.field === field);
      if (el) {
        el.width = e;
      } else {
        console.log("nemelo by")
      }
    }

    this.settingsService.save();

  }

  prefixByType(f: string): string {
    switch (f) {
      case 'status': return 'editor.atm.statuses.';
      case 'model': return 'model.';
      default: return '';
    }
  }

  sortTable(sortState: Sort) {
    this.sortBy.emit(sortState);
  }

  onSelectItem(item: TableItem, event: MouseEvent, idx: number) {
    if (event.detail === 2) {
      // stop on dblclick
      return;
    }
    this.selectItem.emit({ item, event, idx })
  }

  onOpenItem(item: TableItem, event: MouseEvent) {
    this.openItem.emit(item);
  }

  onGetValidationError(id: string) {
    this.getValidationError.emit(id)
  }

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.items().findIndex(d => d === event.item.data);

    moveItemInArray(this.items(), previousIndex, event.currentIndex);
    this.table.renderRows();
    this.dragend.emit(this.items());
  }

  // dropCol(event: CdkDragDrop<any>) {
  //   const previousIndex = this.displayedColumns.findIndex(d => d === event.item.data);

  //   moveItemInArray(this.displayedColumns, previousIndex, event.currentIndex);
  //   this.table.renderRows();
  // }

  filter(field: string, value: string) {
    // const f = this.filters.find(f => f.field === field);
    // if (this.filters[field]) {
    //   f.value = value;
    // } else {
    //   this.filters.push({ field, value });
    // }
    this.onFilter.emit({ field, value });
  }

  columnLink(field: string, value: string) {
    this.onColumnLink.emit({ field, value });
  }
}
