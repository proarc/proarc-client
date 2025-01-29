import { Component, Injectable, signal } from "@angular/core";
import { DocumentItem } from "../model/documentItem.model";
import { ILayoutPanel } from "../dialogs/layout-admin/layout-admin.component";
import { ModelTemplate } from "../model/modelTemplate";
import { Configuration } from "../shared/configuration";
import { Observable, Subject } from "rxjs";

@Injectable()
export class LayoutService {

    constructor(private config: Configuration) { }

    type: string; // 'repo' | 'import'
    panels: ILayoutPanel[] = [];
    editingPanel: string;
    dragging: boolean;

    setPanelEditing(panel: ILayoutPanel) {

        if (panel && this.editingPanel !== panel.id) {
            this.panels.forEach(p => p.canEdit = false || p.type === 'media');
            panel.canEdit = true;
            this.editingPanel = panel.id
        }
    }

    clearPanelEditing() {
        this.panels.forEach(p => p.canEdit = true);
        this.editingPanel = '';
    }

    public lastSelectedItem = signal<DocumentItem>(null); // last selected child item
    public setLastSelectedItem(i: DocumentItem) {
        this.lastSelectedItem.update(() => i)
    }


    private refreshSubject = new Subject<boolean>();


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
        this.setPanelEditing(panel);
        // if (fromTree) {
        //     this.selectionSubject.next(fromStructure);
        //     return;
        // }
        // const num = this.getNumOfSelected();
        // if (num > 1) {
        //     this.selectedChildItem = null;
        // } else if (num === 0) {
        //     this.selectedChildItem = this.item;
        // } else {
        //     this.selectedChildItem = this.getSelected()[0];
        // }
        // this.selectionSubject.next(fromStructure);
    }

    setSelectionChanged(fromStructure: boolean, panel: ILayoutPanel) {
        this.setPanelEditing(panel);
        //this.selectionSubject.next(fromStructure);
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