import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-columns-settings-dialog',
  templateUrl: './columns-settings-dialog.component.html',
  styleUrls: ['./columns-settings-dialog.component.scss']
})
export class ColumnsSettingsDialogComponent implements OnInit {

  modelForColumns: string;
  colsEditModeParent: boolean;
  models: any[];

  constructor(
    public dialogRef: MatDialogRef<ColumnsSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ui: UIService,
    public config: ConfigService,
    public properties: LocalStorageService) { }

  ngOnInit(): void {

    this.colsEditModeParent = this.properties.getColsEditingRepo();
    this.models = this.config.allModels;
    if (this.colsEditModeParent && this.data.itemModel) {
      this.modelForColumns = this.data.itemModel;
    } else if (!this.colsEditModeParent && this.data.selectedModel) {
      this.modelForColumns = this.data.selectedModel;
    } else {
      this.modelForColumns = this.models[0];
    }
    
  }

  setSelectedColumnsEditingRepo() {
    this.properties.setColumnsEditingRepo(this.colsEditModeParent);
    this.ui.showInfo('snackbar.settings.searchColumns.updated');
    this.dialogRef.close(true);
  }

}