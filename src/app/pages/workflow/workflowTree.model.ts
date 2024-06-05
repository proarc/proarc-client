import { WorkFlow } from "src/app/model/workflow.model";
import { ApiService } from "src/app/services/api.service";

export class WorkFlowTree {

    item: WorkFlow
    expanded: boolean;
    expandable: boolean;
    children: WorkFlowTree[];
    loading: boolean;
    level: number;
    parent: WorkFlowTree;

    constructor(item: WorkFlow, canHaveSubJobs: boolean, parent: WorkFlowTree = null, level: number = 0) {
        this.item = item;
        this.parent = parent;
        this.expanded = false;
        this.loading = false;
        this.level = level;
        this.expandable = canHaveSubJobs;
    }


    expand(api: ApiService, all: boolean, callback: any = undefined) {
        if (!this.expandable) {
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
        let params = '?parentId=' + this.item.id;

        api.getWorkflow(params).subscribe((response: any) => {
            // this.children = response.response.data;
            for (const child of response.response.data) {
                const expandable = true;
                const tree = new WorkFlowTree(child, expandable, this, this.level + 1);
                this.children.push(tree);
            }
            this.expanded = true;
            this.loading = false;
            if (all) {
                this.expandChildren(api);
            }
            if (callback) {
                callback(response.response.data);
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

    getParentByLevel(level: number): WorkFlowTree {
        if (this.level === level) {
            return this;
        } else if (!this.parent) {
            return undefined;
        } else {
            return this.parent.getParentByLevel(level);
        }
    }
}
