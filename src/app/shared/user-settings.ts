import { Injectable } from "@angular/core";
import { Configuration } from "./configuration";
import { ApiService } from "../services/api.service";
import { Utils } from "../utils/utils";

interface TableColumn {
    field: string,
    selected: boolean,
    width: number,
    type: string // 'string' | 'translated' | 'date' | 'datetime' | 'boolean' 
}

@Injectable()
export class UserSettings {
    searchModel: string; // Last model used in search
    searchSplit: number = 60; // First split panel in search.

    columnsSearchDefault: TableColumn[] = [
        { field: 'label', selected: true, width: 100, type: 'string' },
        { field: 'model', selected: true, width: 100, type: 'translated' },
        { field: 'pid', selected: true, width: 100, type: 'string' },
        { field: 'processor', selected: true, width: 100, type: 'string' },
        { field: 'organization', selected: true, width: 100, type: 'string' },
        { field: 'status', selected: true, width: 100, type: 'translated' },
        { field: 'created', selected: true, width: 100, type: 'date' },
        { field: 'modified', selected: true, width: 100, type: 'date' },
        { field: 'owner', selected: true, width: 100, type: 'string' },
        { field: 'writeExports', selected: true, width: 100, type: 'string' },
        { field: 'urnNbn', selected: true, width: 100, type: 'string' },
        { field: 'descriptionStandard', selected: true, width: 100, type: 'string' },
        { field: 'partNumber', selected: true, width: 100, type: 'string' },
        { field: 'isLocked', selected: true, width: 100, type: 'boolean' }
    ];

    columnsEditingRepoDefault: TableColumn[] = [
        { field: 'label', selected: true, width: 100, type: 'string' },
        { field: 'filename', selected: true, width: 100, type: 'string' },
        { field: 'pageType', selected: true, width: 100, type: 'string' },
        { field: 'pageNumber', selected: true, width: 100, type: 'string' },
        { field: 'pageIndex', selected: true, width: 100, type: 'string' },
        { field: 'pagePosition', selected: true, width: 100, type: 'string' },

        { field: 'model', selected: true, width: 100, type: 'translated' },
        { field: 'pid', selected: true, width: 100, type: 'string' },
        { field: 'owner', selected: true, width: 100, type: 'string' },
        { field: 'created', selected: true, width: 100, type: 'date' },
        { field: 'modified', selected: true, width: 100, type: 'date' },
        { field: 'status', selected: true, width: 100, type: 'translated' }
    ];

    columnsSearch: TableColumn[];
    columnsSearchTree: TableColumn[];
    colsEditingRepo: { [model: string]: TableColumn[] } = {};

    columnsWorkFlowDefault: TableColumn[] = [
        { field: 'signature', selected: true, width: 150, type: 'string' },
        { field: 'barcode', selected: true, width: 150, type: 'string' },
        { field: 'label', selected: true, width: 150, type: 'string' },
        { field: 'rawPath', selected: false, width: 150, type: 'string' },
        { field: 'profileName', selected: false, width: 150, type: 'list' },
        { field: 'state', selected: false, width: 150, type: 'list' },
        { field: 'taskName', selected: false, width: 150, type: 'list' },
        { field: 'taskUser', selected: false, width: 150, type: 'list' },
        { field: 'priority', selected: false, width: 150, type: 'list' },
        { field: 'created', selected: false, width: 150, type: 'date' },
        { field: 'edition', selected: false, width: 150, type: 'string' },
        { field: 'field001', selected: false, width: 150, type: 'string' },
        { field: 'financed', selected: false, width: 150, type: 'string' },
        { field: 'id', selected: false, width: 150, type: 'string' },
        { field: 'model', selected: false, width: 150, type: 'list' },
        { field: 'modified', selected: false, width: 150, type: 'date' },
        { field: 'ownerId', selected: false, width: 150, type: 'list' },
        { field: 'pid', selected: false, width: 150, type: 'string' },
        { field: 'sigla', selected: false, width: 150, type: 'string' },
        { field: 'year', selected: false, width: 150, type: 'string' },
        { field: 'issue', selected: false, width: 150, type: 'string' },
        { field: 'detail', selected: false, width: 150, type: 'string' },
        { field: 'taskDate', selected: false, width: 150, type: 'date' },
        { field: 'note', selected: false, width: 150, type: 'string' },
        { field: 'volume', selected: false, width: 150, type: 'string' },
        { field: 'deviceLabel', selected: false, width: 150, type: 'string' }
    ];
    columnsWorkFlow: TableColumn[];

    columnsWorkFlowTasksDefault: TableColumn[] = [

        { field: 'profileLabel', selected: true, width: 150, type: 'string' },
        { field: 'state', selected: true, width: 150, type: 'list' },
        // {field: 'profileName', selected: true, width: 150, type: 'list'},
        { field: 'jobLabel', selected: false, width: 150, type: 'string' },
        { field: 'barcode', selected: false, width: 150, type: 'string' },
        { field: 'priority', selected: false, width: 150, type: 'list' },
        { field: 'created', selected: false, width: 150, type: 'date' },
        { field: 'id', selected: false, width: 150, type: 'string' },
        { field: 'modified', selected: false, width: 150, type: 'date' },
        { field: 'ownerId', selected: false, width: 150, type: 'list' },
        { field: 'jobId', selected: false, width: 150, type: 'string' },
        { field: 'note', selected: false, width: 150, type: 'string' },
        { field: 'order', selected: false, width: 150, type: 'string' },
        { field: 'signature', selected: true, width: 150, type: 'string' }
    ];
    columnsWorkFlowTasks: TableColumn[];

    public procMngColumnsDefault: TableColumn[] = [
        { field: 'description', selected: true, width: 100, type: 'string' },
        { field: 'create', selected: true, width: 100, type: 'date' },
        { field: 'timestamp', selected: true, width: 100, type: 'datetime' },
        { field: 'state', selected: true, width: 100, type: 'string' },
        { field: 'profile', selected: true, width: 100, type: 'string' },
        { field: 'user', selected: true, width: 100, type: 'string' },
        { field: 'priority', selected: true, width: 100, type: 'string' },
        { field: 'actions', selected: true, width: 100, type: 'string' }
    ];
    public procMngColumns: TableColumn[];

    public queueColumnsDefault: TableColumn[] = [
        { field: 'description', selected: true, width: 100, type: 'string' },
        { field: 'create', selected: true, width: 100, type: 'date' },
        { field: 'timestamp', selected: true, width: 100, type: 'datetime' },
        { field: 'state', selected: true, width: 100, type: 'string' },
        { field: 'pageCount', selected: true, width: 100, type: 'string' },
        { field: 'user', selected: true, width: 100, type: 'string' }
    ];
    public queueColumns: TableColumn[];

    [key: string]: any; // This is to allow property asignement by name this[k] = o[k];

    constructor(
        private api: ApiService,
        private config: Configuration) {
    }

    reset() {
        this.searchModel = this.config.defaultModel;
        this.columnsSearch = Utils.clone(this.columnsSearchDefault);
        this.columnsSearchTree = Utils.clone(this.columnsSearchDefault);

        this.colsEditingRepo = {};
        this.config.models.forEach((model: string) => {
            this.colsEditingRepo[model] = this.columnsEditingRepoDefault;
            // pro modely stranek zapneme jejich cols
            this.colsEditingRepo[model].forEach(col => {
                col.selected = (model.indexOf('page') < 0 && col.field.indexOf('page') < 0) || (model.indexOf('page') > -1 && col.field.indexOf('page') > -1)
            });

        });

        this.columnsWorkFlow = Utils.clone(this.columnsWorkFlowDefault);
        this.columnsWorkFlowTasks = Utils.clone(this.columnsWorkFlowTasksDefault);
        this.procMngColumns = Utils.clone(this.procMngColumnsDefault);
        this.queueColumns = Utils.clone(this.queueColumnsDefault);
    }

    load(o: any) {
        const keys = Object.keys(o);
        keys.forEach(k => {
            this[k] = o[k];
        });
    }

    save() {
        const keys = ['searchModel', 'columnsSearch', 'columnsSearchTree', 'colsEditingRepo',
            'columnsWorkFlow', 'columnsWorkFlowTasks', 'procMngColumns', 'queueColumns'];
        const toSave: any = {};
        keys.forEach(k => {
            toSave[k] = this[k];
        });
        console.log(toSave);
    }
}