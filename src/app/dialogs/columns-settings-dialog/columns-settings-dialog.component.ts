import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

  selectedColumnsEditingImport: { field: string, selected: boolean }[];
  columnsWorkFlow: { field: string, selected: boolean }[];

  constructor(
    public dialogRef: MatDialogRef<ColumnsSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ui: UIService,
    public config: ConfigService,
    public properties: LocalStorageService) { }

  ngOnInit(): void {

    if (this.data.isWorkFlow) {
      this.columnsWorkFlow = this.properties.getColumnsWorkFlow();

    } else if (this.data.isWorkFlowSubJobs) {
      this.columnsWorkFlow = this.properties.getColumnsWorkFlowSubJobs();

    } else {

      this.colsEditModeParent = this.properties.getColsEditingRepo();
      this.models = this.config.allModels;
      if (this.colsEditModeParent && this.data.selectedParentModel) {
        this.modelForColumns = this.data.selectedParentModel;
      } else {
        this.modelForColumns = this.models[0];
      }

      this.selectedColumnsEditingImport = this.properties.getSelectedColumnsEditingImport();
    }
    
  }

  save() {
    if (this.data.isWorkFlow) {
      this.properties.setColumnsWorkFlow(this.columnsWorkFlow);
      this.dialogRef.close(true);
    } else if (this.data.isWorkFlowSubJobs) {
      this.properties.setColumnsWorkFlowSubJobs(this.columnsWorkFlow);
      this.dialogRef.close(true);
    } else if (this.data.isRepo) {
      this.setSelectedColumnsEditingRepo();
    } else {
      this.setSelectedColumnsEditingImport();
    }
  }

  setSelectedColumnsEditingImport() {
    this.properties.setStringProperty('selectedColumnsImport', JSON.stringify(this.selectedColumnsEditingImport));
    this.ui.showInfo('snackbar.settings.columns.updated');
    this.dialogRef.close(true);
  }

  setSelectedColumnsEditingRepo() {
    this.properties.setColumnsEditingRepo(this.colsEditModeParent);
    this.ui.showInfo('snackbar.settings.columns.updated');
    this.dialogRef.close(true);
  }

  getCurrentList() {
    if (this.data.isWorkFlow) {
      return this.columnsWorkFlow;
    } else if (this.data.isWorkFlowSubJobs) {
      return this.columnsWorkFlow;
    } else if (this.data.isRepo) {
      return this.properties.colsEditingRepo[this.modelForColumns];
    } else {
      return this.selectedColumnsEditingImport;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const list: any[] = this.getCurrentList();
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

}
