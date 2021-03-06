import { ApiService } from "src/app/services/api.service";
import { DocumentItem } from "../documentItem.model";

export class Tree {

    item: DocumentItem
    expanded: boolean;
    children: Tree[];
    loading: boolean;
    level: number;
    parent: Tree;

    constructor(item: DocumentItem, parent: Tree = null, level: number = 0) {
        this.item = item;
        this.parent = parent;
        this.expanded = false;
        this.loading = false;
        this.level = level;
    }

    expand(api: ApiService, all: boolean = false) {
        if (!this.expandable()) {
            return;
        }
        if (this.expanded && !all) {
            return;
        }
        if (this.children) {
            this.expanded = true;
            if (all) {
                this.expandChildren(api);
            }
            return;
        }
        this.loading = true;
        this.children = [];
        api.getRelations(this.item.pid).subscribe((children: DocumentItem[]) => {
            for (const child of children) {
                const tree = new Tree(child, this, this.level + 1);
                this.children.push(tree);
            }
            this.expanded = true;
            this.loading = false;
            if (all) {
                this.expandChildren(api);
            }
        });
    }

    expandChildren(api: ApiService) {
        for (const child of this.children) {
            child.expand(api, true);
        }
    }

    expandAll(api: ApiService) {
        this.expand(api, true);
    }

    expandable(): boolean {
        return !this.item.isPage();
    }

    removable(): boolean {
        return !!this.parent;
    }

    remove() {
        if (!this.parent) {
            return;
        }
        for (let i = this.parent.children.length - 1; i >= 0; i--) {
            if (this == this.parent.children[i]) {
              this.parent.children.splice(i, 1);
              return;
            }
        }
    }
}
