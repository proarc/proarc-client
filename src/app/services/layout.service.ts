import { Injectable, Component } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DocumentItem } from '../model/documentItem.model';
import { Tree } from '../model/mods/tree.model';
import { IConfig } from '../dialogs/layout-admin/layout-admin.component';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { Metadata } from '../model/metadata.model';
import { Page } from '../model/page.model';
import { StreamProfile } from '../model/stream-profile';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  layoutConfig: IConfig = null;

  public ready = false;
  public type: string = 'repo';  // keeps repo or import layout

  public krameriusInstance: string; // in case we are editing kramerius object

  private batchId: string | null;

  // public pid: string; // pid in url
  public rootItem: DocumentItem | null; // root item
  public item: DocumentItem | null; // item by pid
  public tree: Tree;
  public items: DocumentItem[] | null; // all children items
  public selectedParentItem: DocumentItem; // selected item 
  public selectedChildItem: DocumentItem; // selected item in children
  public lastSelectedItem: DocumentItem; // last selected child item
  public lastSelectedItemMetadata: Metadata; // last selected child item
  public krameriusPage: Page; // last selected child item
  public streamProfiles: StreamProfile[];

  path: { pid: string, label: string, model: string }[] = [];
  expandedPath: string[];
  public parent: DocumentItem | null;
  public previousItem: DocumentItem | null;
  public nextItem: DocumentItem | null;

  public isDirty: boolean; // some components have unsaved changes

  private refreshSelectedSubject = new Subject<string>();
  private refreshSubject = new Subject<boolean>();

  private selectionSubject = new ReplaySubject<boolean>(1);
  private moveNextSubject = new ReplaySubject<number>(1);

  private resizedSubject = new Subject<boolean>();

  public movingToNext = false;
  public movedToNextFrom: string;

  dragging = false;

  dirtyComps: {[key: string]: Component} = {};

  constructor() { }

  allowedChildrenModels(): string[]{
    if (this.selectedParentItem) {
      return ModelTemplate.allowedChildrenForModel(this.selectedParentItem.model);
    } else {
      return [];
    }
    
  }
  

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

  clearSelection() {
    this.items.forEach(i => i.selected = false);
    this.clearTree(this.tree)
  }

  clearTree(tree: Tree) {
    tree.item.selected = false;
    if (tree.children) {
      tree.children.forEach(ch => {
        this.clearTree(ch);
      });
    }
  }

  setSelection(fromStructure: boolean, fromTree: boolean = false) {
    // this.movingToNext = false;
    // this.movedToNextFrom = null;
    if (fromTree) {
      this.selectionSubject.next(fromStructure);
      return;
    }
    const num = this.getNumOfSelected();
    if (num > 1) {
      this.selectedChildItem = null;
    } else if (num === 0) {
      this.selectedChildItem = this.item;
    } else {
      this.selectedChildItem = this.getSelected()[0];
    }
    this.selectionSubject.next(fromStructure);
  }

  shouldMoveToNext(from: string) {
    let index = this.getFirstSelectedIndex() + 1;
    this.movedToNextFrom = from;
    this.movingToNext = true;
    this.moveNextSubject.next(index);
  }

  moveToNext(): Observable<number> {
    //let index = this.getFirstSelectedIndex() + 1;
    return this.moveNextSubject.asObservable();
  }

  setSelectionChanged(fromStructure: boolean) {
    this.selectionSubject.next(fromStructure);
  }

  selectionChanged(): Observable<boolean> {
    return this.selectionSubject.asObservable();
  }

  refreshSelectedItem(moveToNext: boolean, from: string) {
    this.refreshSelectedSubject.next(from);
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

  setResized() {
    this.resizedSubject.next(true);
    window.dispatchEvent(new Event('resize'));
  }

  resized(): Observable<boolean> {
    return this.resizedSubject.asObservable();
  }
  

  shouldRefreshSelectedItem(): Observable<any> {
    return this.refreshSelectedSubject.asObservable();
  }

  getSelected() {
    if (this.items) {
      return this.items.filter(item => item.selected);
    } else {
      return [];
    }
    
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

  public showAudioPagesEditor(): boolean {
    if (this.getNumOfSelected() < 2) {
      return false;
    }
    let count = 0;
    for (const child of this.items) {
      if (child.selected) {
        count += 1;
        if (!child.isAudioPage()) {
          return false;
        }
      }
    }
    return count > 0;
  }

}
