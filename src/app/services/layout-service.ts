import { Component, Injectable, signal } from "@angular/core";
import { DocumentItem } from "../model/documentItem.model";
import { ILayoutPanel } from "../dialogs/layout-admin/layout-admin.component";
import { ModelTemplate } from "../model/modelTemplate";
import { Configuration } from "../shared/configuration";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { Page } from "../model/page.model";
import { UserSettings } from "../shared/user-settings";

@Injectable()
export class LayoutService {

    constructor(
        public settings: UserSettings,
        private config: Configuration) { }

    type: string; // 'repo' | 'import'
    panels: ILayoutPanel[] = [];
    editingPanel: string;
    dragging: boolean;

    public panelEditingChanged = signal<string>(null); // last panel edited
    setPanelEditing(panel: ILayoutPanel) {

        if (panel && this.editingPanel !== panel.id) {
            this.panels.forEach(p => {
                if (p.type !== 'media') {
                    p.canEdit = false;
                }
                
            });
            panel.canEdit = true;
            this.editingPanel = panel.id;
            this.panelEditingChanged.update(p => panel.id)
        }

    }

    clearPanelEditing() {
        this.panels.forEach(p => p.canEdit = true);
        this.editingPanel = '';
    }

    public lastSelectedItem = signal<DocumentItem>(null); // last selected child item
    public setLastSelectedItem(i: DocumentItem) {
        this.lastSelectedItem.update(() => i);
    }

    public selectedChildItem: DocumentItem; // selected item in children
    shouldRefreshSelectedItem(): Observable<string> {
        return this.refreshSelectedSubject.asObservable();
      }

    private refreshSubject = new Subject<boolean>();
    private refreshSelectedSubject = new Subject<string>();
    private selectionSubject = new ReplaySubject<boolean>(1);


    public item: DocumentItem; // item by pid in url
    public rootItem: DocumentItem | null; // root item
    public parent: DocumentItem;
    public selectedParentItem: DocumentItem; // parent of selected item 
    expandedPath: string[];

    public previousItem: DocumentItem | null;
    public nextItem: DocumentItem | null;

    public items = signal<DocumentItem[]>(null); // all children items
    public setItems(val: DocumentItem[]) {
        this.items.update(() => val)
    }

    public lastItemIdxClicked: number; // last item clicked
    public lastPanelClicked: string; // last panel clicked
    public moveFocus: boolean = true;

    public krameriusPage: Page;
    public krameriusInstance: string; // in case we are editing kramerius object

    public movedToNextFrom: string;
    public movingToNext: boolean;
    private moveNextSubject = new ReplaySubject<number>(1);

    shouldMoveToNext(from: string) {
        const index = this.items().findIndex(i => i.selected);
        this.movedToNextFrom = from;
        this.movingToNext = true;
        this.moveNextSubject.next(index);
      }

      moveToNext(): Observable<number> {
        //let index = this.getFirstSelectedIndex() + 1;
        return this.moveNextSubject.asObservable();
      }

    batchId: string;

    getSelected() {
        if (this.items) {
            return this.items().filter(item => item.selected);
        } else {
            return [];
        }

    }

    getNumOfSelected() {
        return this.getSelected().length;
    }

    setSelection(fromStructure: boolean, panel: ILayoutPanel, fromTree: boolean = false) {
        if (panel) {
            this.setPanelEditing(panel);
        }
        
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

    selectionChanged(): Observable<boolean> {
        return this.selectionSubject.asObservable();
    }

    setSelectionChanged(fromStructure: boolean, panel: ILayoutPanel) {
        this.setPanelEditing(panel);
        this.selectionSubject.next(fromStructure);
    }

    allowedChildrenModels(): string[] {
        if (this.selectedParentItem) {
            return ModelTemplate.allowedChildrenForModel(this.config.models, this.selectedParentItem.model);
        } else {
            return [];
        }
    }


    shouldRefresh(): Observable<boolean> {
        return this.refreshSubject.asObservable();
    }
    setShouldRefresh(keepSelection: boolean) {
        this.clearPanelEditing();
        if (!keepSelection) {
            this.setLastSelectedItem(null);
        }
        this.refreshSubject.next(keepSelection);
    }

    refreshSelectedItem(moveToNext: boolean, from: string) {
        //this.refreshSelectedSubject.next(from);
    }
}