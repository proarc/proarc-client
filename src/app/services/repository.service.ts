import { Injectable } from '@angular/core';
import { DocumentItem } from '../model/documentItem.model';
import { ApiService } from './api.service';
import { forkJoin, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  public ready = false;
  public pid: string; // pid in url
  public item: DocumentItem | null; // item by pid
  public selection: DocumentItem[] | null; // selected item
  public children: DocumentItem[];
  public lastSelected: DocumentItem | null;

  private selectionSubject = new Subject<DocumentItem>();

  constructor(
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
    });
  }

  selectOne(item: DocumentItem) {
    this.children.forEach(i => i.selected = false);
    item.selected = true;
    this.lastSelected = item;
    this.selectionSubject.next(item)
  }

  selectionChanged(): Observable<DocumentItem> {
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
}
