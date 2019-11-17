import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DocumentItem } from "../model/documentItem.model";
import { DocumentWrapper } from "../model/documentWrapper.model";
import { Router } from "@angular/router";
import { forkJoin } from 'rxjs';

@Injectable()
export class EditorService {

    public lastChildrenViewMode = 'list';
    public lastPageChildrenViewMode = 'icons';


    public state = 'none';
    public ready = false;
    public document: DocumentWrapper;

    constructor(
        private router: Router,
        private api: ApiService) {
    }

    init(params: EditorParams) {
        this.ready = false;
        console.log('------- Editor Service init', params);
        this.state = 'loading';
        const pid = params.pid;
        this.document = null;

        const rDoc = this.api.getDocument(pid);
        const rChildren = this.api.getRelations(pid);
        forkJoin(rDoc, rChildren).subscribe( ([item, children]: [DocumentItem, DocumentItem[]]) => {
            this.document = DocumentWrapper.fromDocumentItem(item);
            this.document.children = children;
            console.log('doc', this.document);
            this.state = 'success';
            this.ready = true;
        }, error => {
            // TODO
        });
    }

    public goToParentObject() {
        console.log('goToParentObject');
        this.state = 'loading';
        this.api.getParent(this.document.pid).subscribe((item: DocumentItem) => {
            console.log('paretnt', item);
            if (item) {
                this.goToObject(item);
            } else {
                this.state = 'success';
            }
        });
    }

    public goToObject(item: DocumentItem) {
        if (item) {
            this.router.navigate(['/document', item.pid]);
        }
    }

    public goToPreviousObject() {
        console.log('goToPreviousObject');
        this.state = 'loading';
        this.api.getParent(this.document.pid).subscribe((item: DocumentItem) => {
            console.log('paretnt', item);
            if (item) {
                this.api.getRelations(item.pid).subscribe((siblings: DocumentItem[]) => {
                    let index = -1;
                    let i = -1;
                    for (const sibling of siblings) {
                        i += 1;
                        if (sibling.pid === this.document.pid) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 1) {
                        this.goToObject(siblings[index - 1]);
                    } else {
                        this.state = 'success';
                    }
                });
            } else {
                this.state = 'success';
            }
        });
    }

    public goToNextObject() {
        console.log('goToNextObject');
        this.state = 'loading';
        this.api.getParent(this.document.pid).subscribe((item: DocumentItem) => {
            console.log('paretnt', item);
            if (item) {
                this.api.getRelations(item.pid).subscribe((siblings: DocumentItem[]) => {
                    let index = -1;
                    let i = -1;
                    for (const sibling of siblings) {
                        i += 1;
                        if (sibling.pid === this.document.pid) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0 && index < siblings.length - 1) {
                        this.goToObject(siblings[index + 1]);
                    } else {
                        this.state = 'success';
                    }
                });
            } else {
                this.state = 'success';
            }
        });
    }

    public save() {
        console.log('save');
        this.state = 'saving';
    }


    saveChildren(callback: () => void) {
        this.state = 'saving';
        const pidArray = this.document.children.map( item => item.pid);
        this.api.editRelations(this.document.pid, pidArray).subscribe(result => {
          console.log('result', result);
          if (callback) {
            callback();
          }
          this.state = 'success';
        });
      }



}

export interface EditorParams {
    pid: string;
}