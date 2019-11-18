import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DocumentItem } from "../model/documentItem.model";
import { DocumentWrapper } from "../model/documentWrapper.model";
import { Router } from "@angular/router";
import { forkJoin } from 'rxjs';
import { Ocr } from "../model/ocr.model";
import { LocalStorageService } from "./local-storage.service";
import { Mods } from "../model/mods.model";
import { Note } from "../model/note.model";

@Injectable()
export class EditorService {

    public state = 'none';
    public ready = false;
    public document: DocumentWrapper;

    public rightEditorType = 'none'; // 'image' | 'comment' | 'ocr' | 'mods'

    public child: DocumentItem;

    constructor(
        private router: Router,
        private api: ApiService,
        private properties: LocalStorageService) {
    }

    init(params: EditorParams) {
        this.child = null;
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
            if (this.document.children.length > 0) {
                this.selectChild(this.document.children[0]);
            }
            console.log('doc', this.document);
            this.state = 'success';
            this.ready = true;
        }, error => {
            // TODO
        });
    }

    public switchRightEditor(type: string) {
        this.rightEditorType = type;
        if (this.child.isPage()) {
            this.properties.setStringProperty('editor.page_right_editor_type', this.rightEditorType);
        } else {
            this.properties.setStringProperty('editor.right_editor_type', this.rightEditorType);
        }
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

    public selectChild(item: DocumentItem) {
        if (item.isPage()) {
            this.rightEditorType = this.properties.getStringProperty('editor.page_right_editor_type', 'image');
        } else {
            this.rightEditorType = this.properties.getStringProperty('editor.right_editor_type', 'mods');
        }
        this.child = item;
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

      saveOcr(ocr: Ocr, callback: (Ocr) => void) {
        this.state = 'saving';
        this.api.editOcr(ocr).subscribe((newOcr: Ocr) => {
          if (callback) {
            callback(newOcr);
          }
          this.state = 'success';
        });
      }

      saveMods(mods: Mods, callback: (Mods) => void) {
        this.state = 'saving';
        this.api.editMods(mods).subscribe(() => {
            this.api.getMods(mods.pid).subscribe((newMods: Mods) => {
                if (callback) {
                    callback(newMods);
                } 
                 this.state = 'success';
            });
        });
      }

      saveNote(note: Note, callback: (Note) => void) {
        this.state = 'saving';
        this.api.editNote(note).subscribe((newNote: Note) => {
            if (callback) {
              callback(newNote);
            }
            this.state = 'success';
          });
      }

}

export interface EditorParams {
    pid: string;
}