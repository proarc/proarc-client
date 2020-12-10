import { Folder } from "src/app/model/folder.model";
import { ApiService } from "src/app/services/api.service";

export class ImportTree {

    folder: Folder;
    expanded: boolean;
    children: ImportTree[];
    loading: boolean;
    level: number;
    parent: ImportTree;

    constructor(folder: Folder, parent: ImportTree = null, level: number = 0) {
        this.folder = folder;
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
        api.getImportFolders(this.folder.path).subscribe((folders: Folder[]) => {
            for (const folder of folders) {
                const tree = new ImportTree(folder, this, this.level + 1);
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
        return this.folder.state == "empty";
    }

    selectable(): boolean {
        return this.folder.state == "new";
    }


}
