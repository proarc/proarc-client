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
}
