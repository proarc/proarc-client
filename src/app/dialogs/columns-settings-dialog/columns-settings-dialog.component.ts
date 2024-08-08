import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
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
    private translator: TranslateService,
    private ui: UIService,
    public config: ConfigService,
    public properties: LocalStorageService) { }

  ngOnInit(): void {

    if (this.data.isWorkFlow) {
      this.columnsWorkFlow = [];
      const all = this.properties.getColumnsWorkFlow();

      const v = all.filter((a: any) => a.selected === true);
      const iv = all.filter((a: any) => a.selected === false);
      iv.sort((a: any, b: any) => {
        const a1: string = this.translator.instant('desc.' + a.field);
        const b1: string = this.translator.instant('desc.' + b.field);
        return a1.localeCompare(b1)
      });
      this.columnsWorkFlow = [...v, ...iv]

    } else if (this.data.isWorkFlowSubJobs) {
      this.columnsWorkFlow = [];
      const all = this.properties.getColumnsWorkFlowSubJobs();

      const v = all.filter((a: any) => a.selected === true);
      const iv = all.filter((a: any) => a.selected === false);
      iv.sort((a: any, b: any) => {
        const a1: string = this.translator.instant('desc.' + a.field);
        const b1: string = this.translator.instant('desc.' + b.field);
        return a1.localeCompare(b1)
      });
      this.columnsWorkFlow = [...v, ...iv]


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
