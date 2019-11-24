import { Metadata } from './../model/metadata.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DocumentItem } from '../model/documentItem.model';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Ocr } from '../model/ocr.model';
import { LocalStorageService } from './local-storage.service';
import { Mods } from '../model/mods.model';
import { Note } from '../model/note.model';
import { Atm } from '../model/atm.model';
import { Page } from '../model/page.model';
import { PageUpdateHolder } from '../components/editor/editor-pages/editor-pages.component';

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

    public metadata: Metadata;

    private multipleChildrenMode: boolean;

    constructor(
        private router: Router,
        private api: ApiService,
        private properties: LocalStorageService) {
    }

    init(params: EditorParams) {
        this.left = null;
        this.right = null;
        this.ready = false;
        this.metadata = null;
        this.multipleChildrenMode = false;
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
                this.leftEditorType = this.properties.getStringProperty('editor.page_left_editor_type', 'page');
            } else {
                this.leftEditorType = this.properties.getStringProperty('editor.left_editor_type', 'metadata');
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

      saveMetadata(callback: () => void) {
        this.state = 'saving';
        this.api.editMetadata(this.metadata).subscribe(() => {
            this.api.getMods(this.metadata.pid).subscribe((mods: Mods) => {
                this.metadata = Metadata.fromMods(mods);
                if (callback) {
                    callback();
                }
                this.state = 'success';
            });
        });
      }

      loadMetadata(callback: () => void) {
        if (this.metadata) {
            callback();
            return;
        }
        this.api.getMetadata(this.right.pid).subscribe((metadata: Metadata) => {
            this.metadata = metadata;
            if (callback) {
                callback();
            }
        });
      }

      deleteSelectedChildren(pernamently: boolean, callback: (boolean) => void) {
        this.state = 'saving';
        let pids: string[];
        if (this.isMultipleChildrenMode()) {
            pids = this.children.filter(c => c.selected).map(c => c.pid);
        } else {
            pids = [this.right.pid];
        }
        this.api.deleteObjects(pids, pernamently).subscribe((removedPid: string[]) => {
            let nextSelection = 0;
            for (let i = this.children.length - 1; i >= 0; i--) {
                if (removedPid.indexOf(this.children[i].pid) > -1) {
                    this.children.splice(i, 1);
                    nextSelection = i - 1;
                }
            }
            if (this.children.length > 0 && !this.isMultipleChildrenMode()) {
                this.selectRight(this.children[nextSelection]);
            }
            if (callback) {
                callback(true);
            }
            this.state = 'success';
        });
      }


      switchMultipleSelectionMode() {
          this.setMultipleChildrenMode(!this.multipleChildrenMode);
      }

      setMultipleChildrenMode(enabled: boolean) {
        const firtsSelectionIndex = this.deselectChildren();
        if (enabled) {
            this.multipleChildrenMode = true;
            this.right.selected = true;
            this.right = null;
        } else {
            this.multipleChildrenMode = false;
            if (this.children.length > firtsSelectionIndex) {
                this.selectRight(this.children[firtsSelectionIndex]);
            }
        }
      }

      // Returns the first selected index
      deselectChildren(): number {
        let firtsSelectionIndex = 0;
        let index = -1;
        for (const child of this.children) {
            index += 1;
            if (child.selected && firtsSelectionIndex === 0) {
                firtsSelectionIndex = index;
            }
            child.selected = false;
        }
        return firtsSelectionIndex;
      }

      selectChildren() {
        for (const child of this.children) {
            child.selected = true;
        }
      }

      isMultipleChildrenMode(): boolean {
          return this.multipleChildrenMode;
      }

      numberOfSelectedChildren(): number {
        let count = 0;
        for (const item of this.children) {
            if (item.selected) {
                count++;
            }
        }
        return count;
      }


      editSelectedPages(holder: PageUpdateHolder, callback: () => void) {
        this.state = 'saving';
        const pages = [];
        let index = -1;
        for (const item of this.children) {
            if (item.isPage() && item.selected) {
                index += 1;
                const page = new Page();
                page.pid = item.pid;
                if (holder.editType) {
                    page.type = holder.pageType;
                }
                if (holder.editIndex) {
                    page.index = String(holder.pageIndex + index);
                }
                if (holder.editNumber) {
                    page.number = String(holder.getNumberForIndex(index));
                }
                pages.push(page);

            }
        }
        this.updatePages(pages, callback);
      }

      private updatePages(pages: Page[], callback: () => void) {
          if (pages.length === 0) {
              this.api.getRelations(this.left.pid).subscribe((children: DocumentItem[]) => {
                  for (const oldChild of this.children) {
                    if (oldChild.selected) {
                        for (const newChild of children) {
                            if (oldChild.pid === newChild.pid) {
                                newChild.selected = true;
                            }
                        }
                    }
                  }
                this.children = children;
                this.state = 'success';
                if (callback) {
                    callback();
                }
              });
              return;
          }
          const pageDef = pages.pop();
          this.api.getPage(pageDef.pid).subscribe((page: Page) => {
            if (pageDef.type) {
                page.type = pageDef.type;
            }
            if (pageDef.index) {
                page.index = pageDef.index;
            }
            if (pageDef.number) {
                page.number = pageDef.number;
            }
            this.api.editPage(page).subscribe((newPage: Page) => {
                this.updatePages(pages, callback);
              });
          });
      }


}

export interface EditorParams {
    pid: string;
}
