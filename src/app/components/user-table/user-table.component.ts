import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ResizecolDirective } from '../../resizecol.directive';
import { UIService } from '../../services/ui.service';
import { Configuration, TableColumn } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Clipboard } from '@angular/cdk/clipboard';
import { DocumentItem } from '../../model/documentItem.model';
import { Utils } from '../../utils/utils';
import { LayoutService } from '../../services/layout-service';

@Component({
  selector: 'app-user-table',
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule,
    MatTableModule, MatSortModule, ResizecolDirective],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {

  colsSettingsName = input<string>();
  items = input<DocumentItem[]>();
  sortField: string;
  sortAsc: boolean;

  sortBy = output<string>();
  selectItem = output<{ item: DocumentItem, event: MouseEvent, idx: number }>();
  openItem = output<DocumentItem>();
  getValidationError = output<string>();

  draggable = input<boolean>();
  mousedown = output<any>(); 
  dragenter = output<{e: any, idx: number}>();  
  dragstart = output<{ item: DocumentItem, e: MouseEvent, idx: number }>();
  dragover = output<any>(); 
  dragend = output<any>(); 

  selectedColumns: TableColumn[];
  displayedColumns: string[];


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
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    public config: Configuration,
    private ui: UIService,
    private layout: LayoutService,
    private clipboard: Clipboard) {
    effect(() => {

      if (this.colsSettingsName() === 'colsEditingRepo') {
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
          models.forEach(model => {
            const f = this.settings.colsEditingRepo[model].filter(c => c.selected && !this.displayedColumns.includes(c.field));
            this.selectedColumns.push(...f);
          });
        }
      } else {
        const colsSettings: TableColumn[] = Utils.clone(this.settings[this.colsSettingsName()]);
        this.selectedColumns = colsSettings.filter(c => c.selected);
      }

      this.displayedColumns = this.selectedColumns.map(c => c.field);
      this.selectedColumns.forEach(c => {
        if (c.type === 'list') {
          this.lists[c.field] = this.getList(c.field);
        }
        this.prefixes[c.field] = this.prefixByType(c.field);
      });

    })
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

    const el = this.settings[this.colsSettingsName()].find((c: any) => c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
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

  copyTextToClipboard(val: string) {
    this.clipboard.copy(val);
    this.ui.showInfoSnackBar(this.translator.instant('snackbar.copyTextToClipboard.success'));
  }

  sortTable(sortState: Sort) {
    this.sortBy.emit(sortState.active);
  }

  onSelectItem(item: DocumentItem, event: MouseEvent, idx: number) {
    if (event.detail === 2) {
      // stop on dblclick
      return;
    }
    this.selectItem.emit({ item, event, idx })
  }

  onOpenItem(item: DocumentItem, event: MouseEvent) {
    this.openItem.emit(item);
  }

  onGetValidationError(id: string) {
    this.getValidationError.emit(id)
  }


  onMousedown(e: any) {
    this.mousedown.emit(e);
  }
  onDragover(e: any) {
    this.dragover.emit(e);
  }
  onDragend(e: any) {
    this.dragend.emit(e);
  }
  onDragenter(e: any, idx: number) {
    this.dragenter.emit({e, idx});
  }
  onDragstart(item: DocumentItem, e: any, idx: number) {
    this.dragstart.emit({item, e, idx});
  }
  
}
