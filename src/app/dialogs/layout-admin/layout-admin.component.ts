import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Utils } from '../../utils/utils';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

export interface ILayoutPanel {
  id: string,
  visible: boolean,
  isEmpty?: boolean,
  size: number,
  type: string,
  isDirty: boolean,
  canEdit: boolean
}

export interface IConfig {
  columns: Array<{
    visible: boolean,
    size: number,
    rows: Array<ILayoutPanel>
  }>
  disabled: boolean
}



@Component({
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule,
    CdkDrag, CdkDragHandle, 
    MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatTooltipModule, MatSelectModule, MatDialogModule
  ],
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {


  config: IConfig = null;
  saved: boolean;

  types = ['structure-list', 'structure-icons', 'metadata', 'mods', 'atm', 'ocr', 'premis', 'comment', 'image', 'media']; // structure-grid has been removed

  constructor(public dialogRef: MatDialogRef<LayoutAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { layout: string },
    public settings: UserSettings,
    private settingsService: UserSettingsService) { }

  ngOnInit() {
    if (!this.data.layout) {
      this.data.layout = 'repo';
    }

    if (this.data.layout === 'repo') {
      this.types.unshift('tree');
    }

    let idx = 0;

    if (this.data.layout === 'repo') {
      this.config = Utils.clone(this.settings.repositoryLayout);
    } else {
      this.config = Utils.clone(this.settings.importLayout);
    }


    this.config.columns.forEach(c => {
      c.rows.forEach(r => {
        if (!r.id) {
          r.id = 'panel' + idx++;
        }
        r.canEdit = true;
      });
    });
  }

  resetConfig() {
    this.config = Utils.clone(this.settingsService.defaultLayoutConfig);
  }

  onDragEnd(columnindex: number, e: any) {
    // Column dragged
    if (columnindex === -1) {
      // Set size for all visible columns
      this.config.columns.filter((c) => c.visible === true).forEach((column, index) => (column.size = e.sizes[index]))
    }
    // Row dragged
    else {
      // Set size for all visible rows from specified column
      this.config.columns[columnindex].rows
        .filter((r) => r.visible === true)
        .forEach((row, index) => (row.size = e.sizes[index]))
    }

    this.settingsService.save();
  }

  toggleColumnVisibility(r: ILayoutPanel) {
    r.visible = !r.visible; 
    this.refreshColumnVisibility();
  }

  refreshColumnVisibility() {
    // Refresh columns visibility based on inside rows visibilities (If no row > hide column)
    this.config.columns.forEach((column, index) => {
      column.visible = column.rows.some((row) => row.visible === true)
    })
  }

  save() {
    if (this.data.layout === 'repo') {
      this.settings.repositoryLayout = Utils.clone(this.config);
    } else {
      this.settings.importLayout = Utils.clone(this.config);
    }
    this.settingsService.save();
    this.saved = true;
    this.dialogRef.close(this.saved);
  }

}
