import { Injectable, Component } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DocumentItem } from '../model/documentItem.model';
import { Metadata } from '../model/metadata.model';
import { Tree } from '../model/mods/tree.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public ready = false;
  public type: string = 'repo';  // keeps repo or import layout

  private batchId: string | null;

  public pid: string; // pid in url
  public item: DocumentItem | null; // item by pid
  public tree: Tree;
  public items: DocumentItem[] | null; // all children items
  //public selection: DocumentItem[] | null; // selected item
  public selectedItem: DocumentItem; // selected item
  public lastSelectedItem: DocumentItem; // selected item

  path: { pid: string, label: string, model: string }[] = [];
  expandedPath: string[];
  public parent: DocumentItem | null;

  public isDirty: boolean; // some components have unsaved changes

  private refreshSubject = new Subject<boolean>();
  private selectionSubject = new ReplaySubject<boolean>(1);
  private moveNextSubject = new ReplaySubject<boolean>(1);
  public movingToNext = false;
  public movedToNextFrom: string;

  
  allowedChildrenModels: string[];

  dirtyComps: {[key: string]: Component} = {};

  constructor() { }

  setIsDirty(comp: Component) {
    if (!this.dirtyComps[comp.selector]) {
      this.dirtyComps[comp.selector] = comp;
    }
  }

  cleanIsDirty(comp: Component) {
    if (this.dirtyComps[comp.selector]) {
      delete this.dirtyComps[comp.selector];
    }
  }

  setSelection(fromStructure: boolean) {
    // this.movingToNext = false;
    // this.movedToNextFrom = null;
    const num = this.getNumOfSelected();
    if (num > 1) {
      this.selectedItem = null;
    } else if (num === 0) {
      this.selectedItem = this.item;
    } else {
      this.selectedItem = this.getSelected()[0];
    }
    this.selectionSubject.next(fromStructure);
  }
  
  shouldMoveToNext(from: string) {
    this.movedToNextFrom = from;
    this.movingToNext = true;
    this.moveNextSubject.next(true);
  }
  
  moveToNext(): Observable<boolean> {
    return this.moveNextSubject.asObservable();
  }
  
  selectionChanged(): Observable<boolean> {
    return this.selectionSubject.asObservable();
  }
  
  setShouldRefresh(keepSelection: boolean) {
    if (!keepSelection) {
      this.lastSelectedItem = null;
    }
    this.refreshSubject.next(keepSelection);
  }
  
  shouldRefresh(): Observable<boolean> {
    return this.refreshSubject.asObservable();
  }

  getSelected() {
    return this.items.filter(item => item.selected);
  }

  getNumOfSelected() {
    return this.getSelected().length;
  }

  getFirstSelectedIndex() {
    return this.items.findIndex(i => i.selected);
  }

  setBatchId(id: string) {
    this.batchId = id;
  }

  getBatchId() {
    return this.batchId;
  }

  public showPagesEditor(): boolean {
    // if (this.relocationMode) {
    //     return false;
    // }
    if (this.getNumOfSelected() < 2) {
        return false;
    }
    let count = 0;
    for (const child of this.items) {
        if (child.selected) {
            count += 1;
            if (!child.isPage()) {
                return false;
            }
        }
    }
    return count > 0;
}

}
