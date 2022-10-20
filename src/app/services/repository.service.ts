import { Component, Injectable } from '@angular/core';
import { DocumentItem } from '../model/documentItem.model';
import { ApiService } from './api.service';
import { forkJoin, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Metadata } from '../model/metadata.model';
import { UIService } from './ui.service';
import { Mods } from '../model/mods.model';
import { ModelTemplate } from '../templates/modelTemplate';
import { NewObjectData, NewObjectDialogComponent } from '../dialogs/new-object-dialog/new-object-dialog.component';
import { NewMetadataDialogComponent } from '../dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  public ready = false;
  public pid: string; // pid in url
  public item: DocumentItem | null; // item by pid
  public selection: DocumentItem[] | null; // selected item
  public children: DocumentItem[] = [];
  public lastSelected: DocumentItem | null;

  private selectionSubject = new Subject<boolean>();

  state: string;
  allowedChildrenModels: string[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private ui: UIService,
    private api: ApiService) { }

  loadData(pid: string) {
    this.ready = false;
    this.pid = pid;
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    forkJoin([rDoc, rChildren]).subscribe(([item, children]: [DocumentItem, DocumentItem[]]) => {
      this.item = item;
      this.children = children;
      this.ready = true;
      this.allowedChildrenModels = ModelTemplate.allowedChildrenForModel(item.model);
    });
  }

  reload() {
    this.loadData(this.pid);
  }

  

  selectAll() {
    this.children.forEach(i => i.selected = true);
    this.selectionSubject.next(true)
  }

  selectOne(item: DocumentItem) {
    this.children.forEach(i => i.selected = false);
    item.selected = true;
    this.lastSelected = item;
    this.selectionSubject.next(true)
  }

  setSelection() {
    this.selectionSubject.next(true);

  }

  selectionChanged(): Observable<boolean> {
    return this.selectionSubject.asObservable();
  }

  getNumOfSelected() {
    return this.children.filter(i => i.selected).length;
  }

  getSelected() {
    return this.children.filter(i => i.selected);
  }

  getFirstSelected() {
    return this.children.find(i => i.selected);
  }

  setIsDirty(comp: Component) {

  }

  hasPendingChanges(): boolean {

    return false;
  }

  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }


  canAddChildren(): boolean {
    return this.allowedChildrenModels && this.allowedChildrenModels.length > 0;
  }

  reindexChildren() {
    let pagePid = null;
    let model = null;
    for (const page of this.children) {
      if (page.isPage()) {
        pagePid = page.pid;
        model = page.model;
        break;
      }
    }
    if (!pagePid) {
      return;
    }
    this.state = 'saving';
    this.api.reindexPages(this.item.pid, pagePid, null, model).subscribe(result => {

      if (result.response.errors) {
        this.ui.showErrorSnackBarFromObject(result.response.errors);
        this.state = 'error';
      } else if (result.response.data) {
        this.ui.showErrorSnackBarFromObject(result.response.data.map((d: any) => d.errorMessage = d.validation));
        this.state = 'error';
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar("Objekty byly reindexovány");
        this.reload();
      }
    });
  }

  onCreateNewObject() {
    if (!this.canAddChildren()) {
      return;
    }
    const data: NewObjectData = {
      models: this.allowedChildrenModels,
      model: this.allowedChildrenModels[0],
      customPid: false,
      parentPid: this.item.pid
    }
    const dialogRef = this.dialog.open(NewObjectDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result['pid']) {

        if (result.isMultiple) {
          this.loadData(data.parentPid);
        } else {
          const dialogRef = this.dialog.open(NewMetadataDialogComponent, { disableClose: true, data: result.data });
          dialogRef.afterClosed().subscribe(res => {
            this.loadData(data.parentPid);
          });
        }

      }
    });

  }

  reloadChildren(callback: () => void, moveToNext = false) {
    this.api.getRelations(this.item.pid).subscribe((children: DocumentItem[]) => {
      if (this.getNumOfSelected() > 1) {
        for (const oldChild of this.children) {
          if (oldChild.selected) {
            for (const newChild of children) {
              if (oldChild.pid === newChild.pid) {
                newChild.selected = true;
              }
            }
          }
        }
      } else {
        if (this.getNumOfSelected() > 0) {
          let index = 0;
          for (let i = 0; i < children.length; i++) {
            if (this.getFirstSelected().pid == children[i].pid) {
              index = i;
              break;
            }
          }
          if (moveToNext && children.length > index + 1) {
            index += 1;
          }
          this.selectOne(children[index]);
        }
      }
      this.children = children;
      if (callback) {
        callback();
      }
    });
  }

}
