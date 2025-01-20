import { Injectable, signal } from "@angular/core";
import { DocumentItem } from "../model/documentItem.model";
import { ILayoutPanel } from "../dialogs/layout-admin/layout-admin.component";

@Injectable()
export class LayoutService {

    panels: ILayoutPanel[] = [];
    editingPanel: string;

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


    public item: DocumentItem; // item by pid in url
    public rootItem: DocumentItem | null; // root item
    public parent: DocumentItem;
    public selectedParentItem: DocumentItem; // parent of selected item 

    public previousItem: DocumentItem | null;
    public nextItem: DocumentItem | null;

    public items = signal<DocumentItem[]>(null); // all children items
    public setItems(val: DocumentItem[]) {
        this.items.update(() => val)
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
}