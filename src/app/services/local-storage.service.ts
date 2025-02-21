
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class LocalStorageService {



    public static LANGUAGE = 'lang';
    public static SEARCH_COLUMNS = 'searchColumns';
    public static SEARCH_COLUMNS_PARENT = 'searchColumnsParent';
    public static EXPANDED_MODELS = 'expandedModels';
    public static ALL_EXPANDED = 'metadata.allExpanded';
    public static RELATED_ITEM_EXPANDED = 'relatedItemExpanded';

    public static TREE_COLUMNS = 'treeColumns';
    public static TREE_COLUMNS_PARENT = 'treeColumnsParent';

    public static COLUMNS_REPO = 'columnsRepo';
    public static COLUMNS_IMPORT = 'columnsImport';

    // availableSearchColumns = ['pageType', 'pageIndex', 'pageNumber', 'model', 'pid', 'owner', 'processor', 
    //     'organization', 'status', 'created', 'modified', 'writeExports', 'isLocked', 'urnNbn', 'descriptionStandard'];
    public selectedColumnsSearchDefault = [
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

    public availableColumnsEditingRepo = ['label', 'filename',
        'pageType', 'pageNumber', 'pageIndex', 'pagePosition', 'model',
        'pid', 'owner', 'created', 'modified', 'status'];

        public availableColumnsWorkFlow = [
            {field: 'signature', selected: true, width: 150, type: 'string'},
            {field: 'barcode', selected: true, width: 150, type: 'string'},
            {field: 'label', selected: true, width: 150, type: 'string'},
            {field: 'rawPath', selected: false, width: 150, type: 'string'},
            {field: 'profileName', selected: false, width: 150, type: 'list'},
            {field: 'state', selected: false, width: 150, type: 'list'},
            {field: 'taskName', selected: false, width: 150, type: 'list'},
            {field: 'taskUser', selected: false, width: 150, type: 'list'},
            {field: 'priority', selected: false, width: 150, type: 'list'},
            {field: 'created', selected: false, width: 150, type: 'date'},
            {field: 'edition', selected: false, width: 150, type: 'string'},
            {field: 'field001', selected: false, width: 150, type: 'string'},
            {field: 'financed', selected: false, width: 150, type: 'string'},
            {field: 'id', selected: false, width: 150, type: 'string'},
            {field: 'model', selected: false, width: 150, type: 'list'},
            {field: 'modified', selected: false, width: 150, type: 'date'},
            {field: 'ownerId', selected: false, width: 150, type: 'list'},
            {field: 'pid', selected: false, width: 150, type: 'string'},
            {field: 'sigla', selected: false, width: 150, type: 'string'},
            {field: 'year', selected: false, width: 150, type: 'string'},
            {field: 'issue', selected: false, width: 150, type: 'string'},
            {field: 'detail', selected: false, width: 150, type: 'string'},
            {field: 'taskDate', selected: false, width: 150, type: 'date'},
            {field: 'note', selected: false, width: 150, type: 'string'},
            {field: 'volume', selected: false, width: 150, type: 'string'},
            {field: 'deviceID', selected: false, width: 150, type: 'list'}
        ];
        public availableColumnsWorkFlowTasks = [

            // {field: 'profileLabel', selected: true, width: 150, type: 'list'},
            {field: 'profileName', selected: true, width: 150, type: 'list'},
            {field: 'state', selected: true, width: 150, type: 'list'},
            {field: 'jobLabel', selected: false, width: 150, type: 'string'},
            {field: 'barcode', selected: false, width: 150, type: 'string'},
            {field: 'priority', selected: false, width: 150, type: 'list'},
            {field: 'created', selected: false, width: 150, type: 'date'},
            {field: 'id', selected: false, width: 150, type: 'string'},
            {field: 'modified', selected: false, width: 150, type: 'date'},
            {field: 'ownerId', selected: false, width: 150, type: 'list'},
            {field: 'jobId', selected: false, width: 150, type: 'string'},
            {field: 'note', selected: false, width: 150, type: 'string'},
            {field: 'order', selected: false, width: 150, type: 'string'},
            {field: 'signature', selected: true, width: 150, type: 'string'}
        ];

    public colsEditingRepo: { [model: string]: { field: string, selected: boolean, width: number }[] };

    public searchColumns: { field: string, selected: boolean; width: number; type: string}[];
    public searchColumnsTree: { field: string, selected: boolean; width: number; type: string}[];
    public searchColumnsTreeSelected: { [field: string]: boolean } = {};


    public procMngColumnsDefault = [
        { field: 'description', selected: true, width: 100 },
        { field: 'create', selected: true, width: 100 },
        { field: 'timestamp', selected: true, width: 100 },
        { field: 'state', selected: true, width: 100 },
        { field: 'profile', selected: true, width: 100 },
        { field: 'user', selected: true, width: 100 },
        { field: 'priority', selected: true, width: 100 },
        { field: 'actions', selected: true, width: 100 }
    ];
    public procMngColumns: { field: string, selected: boolean; }[];


    public queueColumnsDefault = [
        { field: 'description', selected: true, width: 100 },
        { field: 'create', selected: true, width: 100 },
        { field: 'timestamp', selected: true, width: 100 },
        { field: 'state', selected: true, width: 100 },
        { field: 'pageCount', selected: true, width: 100 },
        { field: 'user', selected: true, width: 100 }
    ];
    public queueColumns: { field: string, selected: boolean; }[];


    constructor(
        public config: ConfigService) {
    }

    isSearchColEnabled(field: string): boolean {
        if (!this.searchColumns) {
            this.getSearchColumns();
        }
        return this.searchColumns.findIndex((col: any) => col.field === field && col.selected) > -1;
    }

    isSearchColTreeEnabled(field: string): boolean {
        if (!this.searchColumnsTree) {
            this.getSearchColumnsTree();
        }
        return this.searchColumnsTree.findIndex((col: any) => col.field === field && col.selected) > -1;
    }

    getSearchColumns() {
        const prop = this.getStringProperty('searchColumns');
        if (prop) {
            this.searchColumns = [];
            Object.assign(this.searchColumns, JSON.parse(prop));
        } else {
            this.searchColumns = [];
            Object.assign(this.searchColumns, JSON.parse(JSON.stringify(this.selectedColumnsSearchDefault)));
        }
        return this.searchColumns;
    }

    getQueueColumns() {
        const prop = this.getStringProperty('queueColumns');
        if (prop) {
            this.queueColumns = [];
            Object.assign(this.queueColumns, JSON.parse(prop));
        } else {
            this.queueColumns = [];
            Object.assign(this.queueColumns, JSON.parse(JSON.stringify(this.queueColumnsDefault)));
        }

    }

    getProcMngColumns() {
        const prop = this.getStringProperty('procMngColumns');
        if (prop) {
            this.procMngColumns = [];
            Object.assign(this.procMngColumns, JSON.parse(prop));
        } else {
            this.procMngColumns = [];
            Object.assign(this.procMngColumns, JSON.parse(JSON.stringify(this.procMngColumnsDefault)));
        }

    }

    getSearchColumnsTree() {
        const prop = this.getStringProperty('searchColumnsTree');
        if (prop) {
            this.searchColumnsTree = [];
            Object.assign(this.searchColumnsTree, JSON.parse(prop));
        } else {
            this.searchColumnsTree = [];
            Object.assign(this.searchColumnsTree, JSON.parse(JSON.stringify(this.selectedColumnsSearchDefault)));
        }

        return this.searchColumnsTree;

    }


    setSelectedColumnsSearch() {
        this.setStringProperty('searchColumns', JSON.stringify(this.searchColumns));
    }

    setSelectedColumnsProcMng() {
        this.setStringProperty('procMngColumns', JSON.stringify(this.procMngColumns));
    }

    setSelectedColumnsQueue() {
        this.setStringProperty('queueColumns', JSON.stringify(this.queueColumns));
    }

    setSelectedColumnsSearchTree(cols: { field: string, selected: boolean; width: number; type: string}[]) {
        this.setStringProperty('searchColumnsTree', JSON.stringify(cols));
    }

    resetSelectedColumnsSearchTree() {
        localStorage.removeItem('searchColumnsTree');
    }

    getStringProperty(property: string, defaultValue: string | null = null): string | null {
        return localStorage.getItem(property) || defaultValue;
    }

    setStringProperty(property: string, value: string) {
        return localStorage.setItem(property, value);
    }

    getBoolProperty(property: string, defaultValue: boolean = false) {
        const prop = this.getStringProperty(property);
        if (prop) {
            return prop === '1';
        } else {
            return defaultValue;
        }
    }

    setBoolProperty(property: string, value: boolean) {
        this.setStringProperty(property, value ? '1' : '0');
    }

    getColsEditingRepo(): boolean {
        const prop = this.getStringProperty('colsRepo');
        if (prop) {
            this.colsEditingRepo = {};
            Object.assign(this.colsEditingRepo, JSON.parse(prop));
        } else {
            this.colsEditingRepo = {};
            this.config.allModels.forEach((model: string) => {
                this.colsEditingRepo[model] = this.availableColumnsEditingRepo.map((c: string) => {
                    return {
                        field: c,
                        selected: (model.indexOf('page') < 0 && c.indexOf('page') < 0) || (model.indexOf('page') > -1 && c.indexOf('page') > -1),
                        width: 150
                    }
                });
            })
        }
        return this.getBoolProperty('colsEditModeParent', true);
    }

    getSelectedColumnsEditingImport() {
        const prop = this.getStringProperty('selectedColumnsImport');
        let ret: any = [];
        if (prop) {
            Object.assign(ret, JSON.parse(prop));
        } else {

            ret = this.availableColumnsEditingRepo.map((c: string) => {
                return {
                    field: c,
                    selected: true,
                    width: 150
                }
            });

            // Remove first, label
            ret.shift();
        }
        return ret;
    }

    

    // setColumnsSearchTree(cols: any) {
    //     this.setStringProperty('columnsSearchTree', JSON.stringify(cols));
    // }

    // getColumnsSearchTree() {
    //     const prop = this.getStringProperty('columnsSearchTree');
    //     let ret: any = [];
    //     if (prop) {
    //         Object.assign(ret, JSON.parse(prop));
    //     } else {
    //         ret = this.selectedColumnsSearchDefault.map((c) => {
    //             return c;
    //         });
    //     }
    //     return ret;
    // }



    getColumnsWorkFlow() {
        const prop = this.getStringProperty('columnsWorkFlow');
        let ret: any = [];
        if (prop) {
            Object.assign(ret, JSON.parse(prop));
        } else {

            ret = this.availableColumnsWorkFlow.map((c) => {
                return c;
            });
        }
        return ret;
        
    }

    setColumnsWorkFlow(cols: any) {
        this.setStringProperty('columnsWorkFlow', JSON.stringify(cols));
    }

    resetColumnsWorkFlow() {
        localStorage.removeItem('columnsWorkFlow');
    }

    getColumnsWorkFlowSubJobs() {
        const prop = this.getStringProperty('columnsWorkFlowSubJobs');
        let ret: any = [];
        if (prop) {
            Object.assign(ret, JSON.parse(prop));
        } else {

            ret = this.availableColumnsWorkFlow.map((c) => {
                return c;
            });
        }
        return ret;
        
    }

    setColumnsWorkFlowSubJobs(cols: any) {
        this.setStringProperty('columnsWorkFlowSubJobs', JSON.stringify(cols));
    }

    resetColumnsWorkFlowSubJobs() {
        localStorage.removeItem('columnsWorkFlowSubJobs');
    }

    getColumnsWorkFlowTasks() {
        const prop = this.getStringProperty('columnsWorkFlowTasks');
        let ret: any = [];
        if (prop) {
            Object.assign(ret, JSON.parse(prop));
        } else {

            ret = this.availableColumnsWorkFlowTasks.map((c) => {
                return c;
            });
        }
        return ret;
        
    }

    setColumnsWorkFlowTasks(cols: any) {
        this.setStringProperty('columnsWorkFlowTasks', JSON.stringify(cols));
    }

    resetColumnsWorkFlowTasks() {
        localStorage.removeItem('columnsWorkFlowTasks');
    }

    setColumnsEditingRepo(colsEditModeParent: boolean) {
        this.setStringProperty('colsRepo', JSON.stringify(this.colsEditingRepo));
        this.setBoolProperty('colsEditModeParent', colsEditModeParent);
    }

    resetColumnsEditingRepo() {
        localStorage.removeItem('colsRepo');
    }

    resetColumnsEditingImport() {
        localStorage.removeItem('selectedColumnsImport');
    }

    setColumnsEditingRepoSimple() {
        this.setStringProperty('colsRepo', JSON.stringify(this.colsEditingRepo));
    }

}
