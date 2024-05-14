
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

    availableSearchColumns = ['pageType', 'pageIndex', 'pageNumber', 'model', 'pid', 'owner', 'processor', 'organization', 'status', 'created', 'modified', 'export', 'isLocked'];
    public selectedColumnsSearchDefault = [
        { field: 'label', selected: true, width: 100 },
        { field: 'model', selected: true, width: 100 },
        { field: 'pid', selected: true, width: 100 },
        { field: 'processor', selected: true, width: 100 },
        { field: 'organization', selected: true, width: 100 },
        { field: 'status', selected: true, width: 100 },
        { field: 'created', selected: true, width: 100 },
        { field: 'modified', selected: true, width: 100 },
        { field: 'owner', selected: true, width: 100 },
        { field: 'export', selected: true, width: 100 },
        { field: 'isLocked', selected: true, width: 100 }
    ];

    public availableColumnsEditingRepo = ['label', 'filename',
        'pageType', 'pageNumber', 'pageIndex', 'pagePosition', 'model',
        'pid', 'owner', 'created', 'modified', 'status'];

    public availableColumnsRDFlow = [
        {field: 'created', selected: true, width: 150, type: 'date'},
        {field: 'edition', selected: true, width: 150, type: 'string'},
        {field: 'field001', selected: true, width: 150, type: 'string'},
        {field: 'financed', selected: true, width: 150, type: 'string'},
        {field: 'id', selected: true, width: 150, type: 'string'},
        {field: 'label', selected: true, width: 150, type: 'string'},
        {field: 'model', selected: true, width: 150, type: 'string'},
        {field: 'modified', selected: true, width: 150, type: 'date'},
        {field: 'ownerId', selected: true, width: 150, type: 'select'},
        {field: 'pid', selected: true, width: 150, type: 'string'},
        {field: , selected: true, width: 150},
        {field: , selected: true, width: 150},
        {field: , selected: true, width: 150},
        {field: , selected: true, width: 150},
        {field: , selected: true, width: 150},
        {field: , selected: true, width: 150},
        {field: , selected: true, width: 150},
        ,,, , ,,
        , , , , 'priority',
        'profileName', 'rawPath', 'sigla', 'state', 'year',
        'deviceID', 'deviceLabel', 'signature', 
        'taskName', 'taskUsername'];

    public colsEditingRepo: { [model: string]: { field: string, selected: boolean, width: number }[] };

    public searchColumns: { field: string, selected: boolean; }[];
    public searchColumnsTree: { field: string, selected: boolean; }[];
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

        this.searchColumnsTreeSelected = {};
        this.searchColumnsTree.forEach(c => {
            this.searchColumnsTreeSelected[c.field] = c.selected;
        });

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

    setSelectedColumnsSearchTree() {
        this.setStringProperty('searchColumnsTree', JSON.stringify(this.searchColumnsTree));
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

    getColumnsRDFlow() {
        const prop = this.getStringProperty('columnsRDFlow');
        let ret: any = [];
        if (prop) {
            Object.assign(ret, JSON.parse(prop));
        } else {

            ret = this.availableColumnsRDFlow.map((c: string) => {
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

    setColumnsRDFlow(cols: any) {
        this.setStringProperty('columnsRDFlow', JSON.stringify(cols));
    }

    setColumnsEditingRepo(colsEditModeParent: boolean) {
        this.setStringProperty('colsRepo', JSON.stringify(this.colsEditingRepo));
        this.setBoolProperty('colsEditModeParent', colsEditModeParent);
    }

    setColumnsEditingRepoSimple() {
        this.setStringProperty('colsRepo', JSON.stringify(this.colsEditingRepo));
    }

}
