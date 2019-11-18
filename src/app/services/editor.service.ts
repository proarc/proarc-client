import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DocumentItem } from "../model/documentItem.model";
import { Router } from "@angular/router";
import { forkJoin } from 'rxjs';
import { Ocr } from "../model/ocr.model";
import { LocalStorageService } from "./local-storage.service";
import { Mods } from "../model/mods.model";
import { Note } from "../model/note.model";
import { Atm } from "../model/atm.model";
import { Page } from "../model/page.model";

@Injectable()
export class EditorService {

    public state = 'none';
    public ready = false;
    // public document: DocumentWrapper;

    public rightEditorType = 'none'; // 'image' | 'comment' | 'ocr' | 'mods' | 'atm' | 'page'

    public leftEditorType = 'none'; // 'children' | 'image' | 'comment' | 'ocr' | 'mods' | 'atm' | 'page'

    public mode = 'chldren'; // 'detal' | 'children'

    public left: DocumentItem;
    public right: DocumentItem;
    public children: DocumentItem[];

    constructor(
        private router: Router,
        private api: ApiService,
        private properties: LocalStorageService) {
    }

    init(params: EditorParams) {
        this.left = null;
        this.right = null;
        this.ready = false;
        this.state = 'loading';
        const pid = params.pid;

        const rDoc = this.api.getDocument(pid);
        const rChildren = this.api.getRelations(pid);
        forkJoin(rDoc, rChildren).subscribe( ([item, children]: [DocumentItem, DocumentItem[]]) => {
            this.left = item;
            this.children = children;
            if (item.isPage()) {
                this.switchMode('detail');
            } else {
                const mode = this.properties.getStringProperty('editor.mode', 'detail');
                this.switchMode(mode);
            }
            this.state = 'success';
            this.ready = true;
        }, error => {
            // TODO
        });
    }

    public onlyPageChildren(): boolean {
        for (const child of this.children) {
          if (!child.isPage()) {
            return false;
          }
        }
        return true;
      }

    public switchLeftEditor(type: string) {
        this.leftEditorType = type;
        if (this.left.isPage()) {
            this.properties.setStringProperty('editor.page_left_editor_type', this.leftEditorType);
        } else {
            this.properties.setStringProperty('editor.left_editor_type', this.leftEditorType);
        }
    }

    public switchRightEditor(type: string) {
        this.rightEditorType = type;
        if (this.right.isPage()) {
            this.properties.setStringProperty('editor.page_right_editor_type', this.rightEditorType);
        } else {
            this.properties.setStringProperty('editor.right_editor_type', this.rightEditorType);
        }
    }

    public switchMode(mode: string) {
        this.mode = mode;
        if (!this.left.isPage()) {
            this.properties.setStringProperty('editor.mode', this.mode);
        }
        if (this.mode === 'children') {
            if (this.children.length > 0) {
                this.selectRight(this.children[0]);
            }
        } else {
            this.selectRight(this.left);
            if (this.left.isPage()) {
                this.leftEditorType = this.properties.getStringProperty('editor.page_left_editor_type', 'image');
            } else {
                this.leftEditorType = this.properties.getStringProperty('editor.left_editor_type', 'mods');
            }
        }
    }

    public goToParentObject() {
        this.state = 'loading';
        this.api.getParent(this.left.pid).subscribe((item: DocumentItem) => {
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

    public selectRight(item: DocumentItem) {
        if (item.isPage()) {
            this.rightEditorType = this.properties.getStringProperty('editor.page_right_editor_type', 'image');
        } else {
            this.rightEditorType = this.properties.getStringProperty('editor.right_editor_type', 'mods');
        }
        this.right = item;
    }

    public goToPreviousObject() {
        console.log('goToPreviousObject');
        this.state = 'loading';
        this.api.getParent(this.left.pid).subscribe((item: DocumentItem) => {
            console.log('paretnt', item);
            if (item) {
                this.api.getRelations(item.pid).subscribe((siblings: DocumentItem[]) => {
                    let index = -1;
                    let i = -1;
                    for (const sibling of siblings) {
                        i += 1;
                        if (sibling.pid === this.left.pid) {
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
        this.api.getParent(this.left.pid).subscribe((item: DocumentItem) => {
            console.log('paretnt', item);
            if (item) {
                this.api.getRelations(item.pid).subscribe((siblings: DocumentItem[]) => {
                    let index = -1;
                    let i = -1;
                    for (const sibling of siblings) {
                        i += 1;
                        if (sibling.pid === this.left.pid) {
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

    saveChildren(callback: () => void) {
        this.state = 'saving';
        const pidArray = this.children.map( item => item.pid);
        this.api.editRelations(this.left.pid, pidArray).subscribe(result => {
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

      saveAtm(atm: Atm, callback: (Atm) => void) {
        this.state = 'saving';
        this.api.editAtm(atm, ).subscribe((newAtm: Atm) => {
            if (callback) {
              callback(newAtm);
            }
            this.state = 'success';
          });
      }

      savePage(page: Page, callback: (Page) => void) {
        this.state = 'saving';
        this.api.editPage(page).subscribe((newPage: Page) => {
            if (callback) {
              callback(newPage);
            }
            this.state = 'success';
          });
      }

}

export interface EditorParams {
    pid: string;
}
