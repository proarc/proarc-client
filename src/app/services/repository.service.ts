import { Component, Injectable } from '@angular/core';
import { DocumentItem } from '../model/documentItem.model';
import { ApiService } from './api.service';
import { forkJoin, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Metadata } from '../model/metadata.model';
import { UIService } from './ui.service';
import { Mods } from '../model/mods.model';

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
  public metadata: { [key: string]: Metadata } = {};

  private selectionSubject = new Subject<boolean>();

  state: string;

  constructor(
    private router: Router,
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
    });
  }

  loadMetadata(pid: string, model: string) {
    if (this.metadata[pid]) {
      return;
    }
    this.api.getMetadata(pid, model).subscribe((metadata: Metadata) => {
      this.metadata[pid] = metadata;
    });
  }

  saveMetadata(pid: string, model: string, ignoreValidation: boolean, callback: (r: any) => void) {
    //this.state = 'saving';
    this.api.editMetadata(this.metadata[pid], ignoreValidation).subscribe((response: any) => {
      if (response.errors) {
        if (response.status === -4) {
          // Ukazeme dialog a posleme s ignoreValidation=true
          //this.state = 'error';
          if (callback) {
            callback(response);
          }
          return;
        } else {
          this.ui.showErrorSnackBarFromObject(response.errors);
          //this.state = 'error';
          return;
        }
        return;
      }


      const rDoc = this.api.getDocument(pid);
      const rMods = this.api.getMods(pid);
      forkJoin([rDoc, rMods]).subscribe(([doc, responseMods]: [DocumentItem, any]) => {

        const mods: Mods = Mods.fromJson(responseMods['record']);

        this.metadata[pid] = Metadata.fromMods(mods, model);

        //this.state = 'success';
      });
    });
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

  public goToObject(item: DocumentItem) {
    if (item) {
      this.router.navigate(['/repository', item.pid]);
    }
  }

  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }
}
