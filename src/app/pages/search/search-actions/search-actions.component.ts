
import { Component, computed, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DocumentItem, TreeDocumentItem } from '../../../model/documentItem.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { UrnnbnDialogComponent } from '../../../dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { ExportDialogComponent } from '../../../dialogs/export-dialog/export-dialog.component';
import { SimpleDialogData } from '../../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../../dialogs/simple-dialog/simple-dialog.component';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { Configuration } from '../../../shared/configuration';
import { ChangeModelDialogComponent } from '../../../dialogs/change-model-dialog/change-model-dialog.component';
import { ConvertDialogComponent } from '../../../dialogs/convert-dialog/convert-dialog.component';
import { UpdateInSourceDialogComponent } from '../../../dialogs/update-in-source-dialog/update-in-source-dialog.component';
import { CzidloDialogComponent } from '../../../dialogs/czidlo-dialog/czidlo-dialog.component';
import { UserSettings } from '../../../shared/user-settings';

@Component({
  selector: 'app-search-actions',
  imports: [TranslateModule, FormsModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatDialogModule],
  templateUrl: './search-actions.component.html',
  styleUrl: './search-actions.component.scss'
})
export class SearchActionsComponent {

  forTree = input<boolean>();

  items = input<DocumentItem[]>();
  selectedItem = input<DocumentItem>();

  treeItems = input<TreeDocumentItem[]>();
  selectedTreeItem = input<TreeDocumentItem>();

  reload = output<string>();
  reloadTree = output<string>();
  state = model<string>();

  isAkubra: boolean;

  constructor(
    private dialog: MatDialog,
    private translator: TranslateService,
    public config: Configuration,
    public auth: AuthService,
    private api: ApiService,
    private ui: UIService,
    public settings: UserSettings) {

  }

  ngOnInit() {
      this.isAkubra = this.config.info.storage === 'Akubra';
  }

  totalSelected() {
    return this.items().filter(i => i.selected).length;
  } 

  totalSelectedTree() {
    return this.treeItems().filter(i => i.selected).length;
  } 

  

  onUrnnbn(inSearch: boolean) {
    const pids = inSearch ?
      this.items().filter(i => i.selected).map(i => i.pid) :
      [this.selectedTreeItem().pid];
    const dialogRef = this.dialog.open(UrnnbnDialogComponent, {
      data: pids,
      panelClass: ['app-dialog-urnbnb', 'app-form-view-' + this.settings.appearance],
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  canExport() {

    const selected = this.forTree() ?
       this.treeItems().filter(i => i.selected) :
      this.items().filter(i => i.selected);


    const models: string[] = [];
    selected.forEach(i => {
      if (!models.includes(i.model)) {
        models.push(i.model);
      }
    });
    return models.length < 2;
  }

  onExport() {
    const items = !this.forTree() ?
      this.items().filter(i => i.selected).map(i => { return { pid: i.pid, model: i.model } }) :
      [{ pid: this.selectedTreeItem().pid, model: this.selectedTreeItem().model }];
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      disableClose: true,
      data: items,
      width: '600px',
      panelClass: ['app-dialog-export', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  onDeleteItem() {
    const pids = this.items().filter(i => i.selected).map(i => i.pid)
    this.onDelete(pids, true, (pids: string[]) => {
      for (let i = this.items.length - 1; i >= 0; i--) {
        if (pids.indexOf(this.items()[i].pid) > -1) {
          this.items().splice(i, 1);
        }
      }
    });
  }

  private onDelete(pids: string[], refresh: boolean, callback: (pids: string[]) => any = null) {
    const checkbox = {
      label: String(this.translator.instant('dialog.removeObject.checkbox')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.removeObject.title')),
      message: String(this.translator.instant('dialog.removeObject.message')) + ": " + pids.length + '?',
      alertClass: 'app-warn',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      },
      // checkbox: this.auth.isSuperAdmin() ? checkbox : undefined
    };
    if (this.auth.isSuperAdmin()) {
      data.checkbox = checkbox;
    }
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: data,
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteObject(pids, checkbox.checked, refresh, callback);
      }
    });
  }

  onDeleteFromTree() {
    const refresh = this.selectedTreeItem().parent ? false : true;
    const pids = this.treeItems().filter(i => i.selected).map(i => i.pid)
    this.onDelete(pids, true, (pids: string[]) => {
      // this.search.selectedTree.remove();
    });
  }

  private deleteObject(pids: string[], pernamently: boolean, refresh: boolean, callback: (pids: string[]) => any = null) {
    this.state.update(() => 'loading');// = 'loading';
    this.api.deleteObjects(pids, pernamently).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state.update(() => 'error');
        return;
      } else {
        const removedPid: string[] = response['response']['data'].map((x: any) => x.pid);
        if (callback) {
          callback(removedPid);
        }
        this.state.update(() => 'success');
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.removeObject.success')));
        if (refresh) {
          this.reload.emit(null);
        }

      }
    });
  }

  showFoxml() {
    const pid = this.forTree() ? this.selectedTreeItem().pid : this.selectedItem().pid;
    window.open(this.api.getApiUrl() + 'object/dissemination?pid=' + pid, 'foxml');
  }

  onRestore() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Obnovit objekt')),
      message: String(this.translator.instant('Opravdu chcete vybrané objekty obnovit?')),
      alertClass: 'app-message',
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.api.restoreObject(item.pid, false, false).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            this.state.update(() => 'error');
            return;
          } else {
            this.ui.showInfoSnackBar('Objekt byl úspěšně obnoven');
            this.reload.emit(null);
          }
        });
      }
    });
  }

  onLock(lock: boolean) {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    const data: SimpleDialogData = {
      title: lock ? String(this.translator.instant('dialog.lockObject.title')) : String(this.translator.instant('dialog.unlockObject.title')),
      message: lock ? String(this.translator.instant('dialog.lockObject.message')) : String(this.translator.instant('dialog.unlockObject.message')),
      alertClass: 'app-info',
      btn1: {
        label: String(this.translator.instant('button.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('button.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: data,
      width: '600px',
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (lock) {
          this.lockObject(item);
        } else {
          this.unlockObject(item);
        }

      }
    });
  }

  changeLockInTree(item: TreeDocumentItem, isLocked: boolean, idx: number) {
    for (let i = idx; i < this.treeItems.length; i++) {
      const j = this.treeItems()[i]
      if (j.parentPid === item.pid) {
        j.isLocked = isLocked;
        this.changeLockInTree(j, isLocked, i)
      }
    }
  }

  lockObject(item: DocumentItem) {
    this.api.lockObjects([item.pid], item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state.update(() => 'error');
        return;
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.search.lockObject')));
        item.isLocked = true;
        const treeItem = this.treeItems().find(it => it.pid === item.pid);
        if (treeItem) {
          this.changeLockInTree(treeItem, true, this.treeItems().indexOf(treeItem));
        }
      }

    });
  }

  unlockObject(item: DocumentItem) {
    this.api.unlockObjects([item.pid], item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state.update(() => 'error');
        return;
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.search.unlockObject')));
        item.isLocked = false;
        const treeItem = this.treeItems().find(it => it.pid === item.pid);
        if (treeItem) {
          this.changeLockInTree(treeItem, false, this.treeItems().indexOf(treeItem));
        }
      }
    });
  }

  canChangeModel(): boolean {
    if (!this.selectedTreeItem()) {
      return false;
    }
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    return this.config.modelChanges.findIndex(m => ('model:' + m.origin).toLocaleLowerCase() === item.model.toLocaleLowerCase()) > -1
  }

  changeModel() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    const dialogRef = this.dialog.open(ChangeModelDialogComponent, {
      width: '520px',
      data: {
        pid: item.pid,
        model: item.model,
        dest: this.config.modelChanges.find(m => ('model:' + m.origin).toLocaleLowerCase() === item.model.toLocaleLowerCase()).dest
      },
      panelClass: ['app-dialog-change-model', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reload.emit(null)
      }
    });
  }

  updateObjects() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    this.state.update(() => 'loading');
    this.api.updateObjects(item.pid, item.model).subscribe((response: any) => {
      if (response.response.errors) {
        this.state.update(() => 'error');
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.state.update(() => 'success');
        this.ui.showInfoSnackBar(this.translator.instant('snackbar.updateObjects.success'))
      }
    });
  }

  

  showConvertDialog() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    const dialogRef = this.dialog.open(ConvertDialogComponent, {
      data: { pid: item.pid, model: item.model },
      panelClass: ['app-dialog-convert', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.status == 'ok') {
          this.ui.showInfoSnackBar(this.translator.instant('snackbar.convertPages.success'));

        } else if (result.status == 'failure') {
          this.ui.showInfoSnackBar(this.translator.instant('snackbar.convertPages.failure'));
        }
        this.reload.emit(null);
      }
    });
  }

  czidlo() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    const dialogRef = this.dialog.open(CzidloDialogComponent, {
      data: { pid: item.pid, model: item.model },
      width: '400px',
      panelClass: ['app-dialog-urnbnb', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  canUpdateInSource() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    return this.config.updateInSourceModels.includes(item?.model)
  }

  updateInSource() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    const dialogRef = this.dialog.open(UpdateInSourceDialogComponent, {
      data: item.pid,
      width: '600px',
      panelClass: ['app-dialog-urnbnb', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

      }
    });
  }

  validateObject() {
    const item: DocumentItem = this.forTree() ? this.selectedTreeItem() : this.selectedItem();
    this.state.update(() => 'loading');
    this.api.validateObject(item.pid).subscribe((response: any) => {
      if (response.response.errors) {
        this.state.update(() => 'error');
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.state.update(() => 'success');
        this.ui.showInfoSnackBar(response.response.data[0].msg)
      }
    });
  }

  canCopy(item: DocumentItem): boolean {
    return item && this.config.allowedCopyModels.includes(item.model)
  }

  onCopyItem(treeItem: TreeDocumentItem) {
    this.state.update(() => 'loading');
    this.api.copyObject(treeItem.pid, treeItem.model).subscribe((response: any) => {

      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state.update(() => 'error');
        return;
      } else if (response.response.data && response.response.data[0].validation) {
        this.ui.showErrorDialogFromObject(response.response.data.map((d: any) => d.errorMessage = d.validation));
        this.state.update(() => 'error');
      } else {
        const newPid = response.response.data[0].pid;
        this.state.update(() => 'success');
        this.ui.showInfoSnackBar("Objekty byly zkopirovane");
        this.reloadTree.emit(newPid);
      }
    }, error => {
      console.log(error);
      this.ui.showInfoSnackBar(error.statusText);
      this.state.update(() => 'error');
    });
  }


}
