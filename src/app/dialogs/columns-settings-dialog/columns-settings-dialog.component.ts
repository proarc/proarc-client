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

  selectedColumnsEditingImport: { field: string, selected: boolean}[];
  columnsWorkFlow: { field: string, selected: boolean, width: number, type: string  }[];

  constructor(
    public dialogRef: MatDialogRef<ColumnsSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translator: TranslateService,
    private ui: UIService,
    public config: ConfigService,
    public properties: LocalStorageService) { }

  ngOnInit(): void {
    this.initColumns()


  }

  initColumns() {
    let all;
    let selected;
    let rest;
    switch (this.data.type) {
      case 'jobs':
        all = this.properties.getColumnsWorkFlow();
        break;
      case 'subjobs':
        all = this.properties.getColumnsWorkFlowSubJobs();
        break;
      case 'tasks':
        all = this.properties.getColumnsWorkFlowTasks();
        break;
      case 'searchTree':
        all = this.properties.getSearchColumnsTree();
        break;
      default:
        this.colsEditModeParent = this.properties.getColsEditingRepo();
        this.models = this.config.allModels;
        if (this.colsEditModeParent && this.data.selectedParentModel) {
          this.modelForColumns = this.data.selectedParentModel;
        } else {
          this.modelForColumns = this.models[0];
        }

        this.selectedColumnsEditingImport = this.properties.getSelectedColumnsEditingImport();

    }

    if (!this.data.isRepo) {
      this.columnsWorkFlow = [];
      selected = all.filter((a: any) => a.selected === true);
      rest = all.filter((a: any) => a.selected === false);
      rest.sort((a: any, b: any) => {
        const a1: string = this.translator.instant('desc.' + a.field);
        const b1: string = this.translator.instant('desc.' + b.field);
        return a1.localeCompare(b1)
      });
      this.columnsWorkFlow = [...selected, ...rest]
    }
  }

  reset() {
    switch (this.data.type) {
      case 'jobs':
      this.properties.resetColumnsWorkFlow();
        break;
      case 'subjobs':
      this.properties.resetColumnsWorkFlowSubJobs();
        break;
      case 'tasks':
      this.properties.resetColumnsWorkFlowTasks();
        break;
      case 'searchTree':
        this.properties.resetSelectedColumnsSearchTree();
        break;
      default:
        if (this.data.isRepo) {
          this.properties.resetColumnsEditingRepo();
        } else {
          this.properties.resetColumnsEditingImport();
        }
    }
    this.initColumns();
  }

  save() {

    switch (this.data.type) {
      case 'jobs':
      this.properties.setColumnsWorkFlow(this.columnsWorkFlow);
      this.dialogRef.close(true);
        break;
      case 'subjobs':
      this.properties.setColumnsWorkFlowSubJobs(this.columnsWorkFlow);
      this.dialogRef.close(true);
        break;
      case 'tasks':
      this.properties.setColumnsWorkFlowTasks(this.columnsWorkFlow);
      this.dialogRef.close(true);
        break;
      case 'searchTree':
        this.properties.setSelectedColumnsSearchTree(this.columnsWorkFlow);
        this.dialogRef.close(true);
        break;
      default:
        if (this.data.isRepo) {
          this.setSelectedColumnsEditingRepo();
        } else {
          this.setSelectedColumnsEditingImport();
        }
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
    if (this.data.isRepo) {
      return this.properties.colsEditingRepo[this.modelForColumns];
    } else if (this.data.isImport) {
      return this.selectedColumnsEditingImport;
    } else {
      return this.columnsWorkFlow;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const list: any[] = this.getCurrentList();
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

}
