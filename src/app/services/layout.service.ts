import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DocumentItem } from '../model/documentItem.model';
import { Metadata } from '../model/metadata.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public ready = false;
  public type: string = 'repo';  // keeps repo or import layout

  private batchId: string | null;

  public pid: string; // pid in url
  public item: DocumentItem | null; // item by pid
  public items: DocumentItem[] | null; // all children items
  //public selection: DocumentItem[] | null; // selected item
  public selectedItem: DocumentItem; // selected item

  public isDirty: boolean; // some components have unsaved changes

  private selectionSubject = new Subject<boolean>();
  private moveNextSubject = new Subject<boolean>();

  constructor() { }

  setSelection() {
    
    const num = this.getNumOfSelected();
    if (num > 1) {
      this.selectedItem = null;
    } else if (num === 0) {
      this.selectedItem = this.item;
    } else {
      this.selectedItem = this.getSelected()[0];
    }
    this.selectionSubject.next(true);
  }
  
  moveToNext(): Observable<boolean> {
    return this.moveNextSubject.asObservable();
  }
  
  selectionChanged(): Observable<boolean> {
    return this.selectionSubject.asObservable();
  }

  getSelected() {
    return this.items.filter(item => item.selected);
  }

  getNumOfSelected() {
    return this.getSelected().length;
  }

  getBatchId() {
    return this.batchId;
  }

}
