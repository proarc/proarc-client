import { Folder } from "src/app/model/folder.model";
import { ApiService } from "src/app/services/api.service";
import { UIService } from "src/app/services/ui.service";

export class ImportTree {

    folder: Folder;
    expanded: boolean;
    children: ImportTree[];
    loading: boolean;
    level: number;
    parent: ImportTree;

    constructor(
        folder: Folder, 
        parent: ImportTree = null, level: number = 0) {
        this.folder = folder;
        this.parent = parent;
        this.expanded = false;
        this.loading = false;
        this.level = level;
    }

    expand(api: ApiService, ui: UIService, all: boolean = false) {
        if (!this.expandable()) {
            return;
        }
        if (this.expanded && !all) {
            return;
        }
        if (this.children) {
            this.expanded = true;
            if (all) {
                this.expandChildren(api, ui);
            }
            return;
        }
        this.loading = true;
        this.children = [];
        api.getImportFolders(this.folder.path).subscribe((response: any) => {
            // .pipe(map(response => Folder.fromJsonArray(response['response']['data'])));
            if (response['response'].errors) {
                console.log('getImportFolders error', response['response'].errors);
                ui.showErrorSnackBarFromObject(response['response'].errors);
                return;
            }
            const folders: Folder[] = Folder.fromJsonArray(response['response']['data']);
            for (const folder of folders) {
                const tree = new ImportTree(folder, this, this.level + 1);
                this.children.push(tree);
            }
            this.expanded = true;
            this.loading = false;
            if (all) {
                this.expandChildren(api, ui);
            }
        });
    }

    expandChildren(api: ApiService, ui: UIService) {
        for (const child of this.children) {
            child.expand(api, ui, true);
        }
    }

    expandAll(api: ApiService, ui: UIService) {
        this.expand(api, ui, true);
    }

    expandable(): boolean {
        return this.folder.state == "empty";
    }

    selectable(): boolean {
        return this.folder.state == "new";
    }


}
