import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UIService } from '../../services/ui.service';
import { Configuration, TableColumn } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Utils } from '../../utils/utils';

@Component({
  imports: [TranslateModule, MatDialogModule, CdkDropList, CdkDrag, MatTableModule, MatSelectModule, MatRadioModule, MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule, FormsModule, MatCheckboxModule],
  selector: 'app-columns-settings-dialog',
  templateUrl: './columns-settings-dialog.component.html',
  styleUrls: ['./columns-settings-dialog.component.scss']
})
export class ColumnsSettingsDialogComponent implements OnInit {

  modelForColumns: string;
  colsEditModeParent: boolean;
  models: any[];

  selectedColumnsEditingImport: { field: string, selected: boolean}[];
  columns: TableColumn[];

  constructor(
    public dialogRef: MatDialogRef<ColumnsSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {colsSettingsName: string, model: string},
    private translator: TranslateService,
    private ui: UIService,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    public config: Configuration) { }

  ngOnInit(): void {
    this.initColumns()
  }

  initColumns() {
    this.colsEditModeParent = this.settings.colsEditModeParent;
    this.modelForColumns = this.data.model;
    let all: TableColumn[];
    let selected: TableColumn[];
    let rest: TableColumn[];
    if (this.data.colsSettingsName === 'colsEditingRepo') {
            
      if (this.settings.colsEditModeParent && this.data.model) {
        selected = this.settings.colsEditingRepo[this.data.model].filter(c => c.selected);

      } else {
        this.config.models.forEach(model => {
          const f = this.settings.colsEditingRepo[model].filter(c => c.selected);
          selected.push(...f);
        });
      }
    } else {
      all = Utils.clone(this.settings[this.data.colsSettingsName]);
      selected = all.filter(c => c.selected);
    }

    if (this.data.colsSettingsName !== 'colsEditingRepo') {
      this.columns = [];
      selected = all.filter((a: any) => a.selected === true);
      rest = all.filter((a: any) => a.selected === false);
      rest.sort((a: any, b: any) => {
        const a1: string = this.translator.instant('desc.' + a.field);
        const b1: string = this.translator.instant('desc.' + b.field);
        return a1.localeCompare(b1)
      });
      this.columns = [...selected, ...rest]
    }
  }

  reset() {
    this.initColumns();
  }

  save() {
    if (this.data.colsSettingsName === 'colsEditingRepo') {
      this.settings.colsEditModeParent = this.colsEditModeParent;
    } else {
      this.settings[this.data.colsSettingsName] = this.columns;
    }
    this.settingsService.save();
    this.dialogRef.close(true);
    
  }

  drop(event: CdkDragDrop<string[]>) {
    const list: any[] = this.data.colsSettingsName === 'colsEditingRepo' ? this.settings.colsEditingRepo[this.data.model] : this.columns;
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

}
