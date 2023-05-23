
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
        { field: 'label', selected: true },
        { field: 'model', selected: true },
        { field: 'pid', selected: true },
        { field: 'processor', selected: true },
        { field: 'organization', selected: true },
        { field: 'status', selected: true },
        { field: 'created', selected: true },
        { field: 'modified', selected: true },
        { field: 'owner', selected: true },
        { field: 'export', selected: true },
        { field: 'isLocked', selected: true }
    ];

    public availableColumnsEditingRepo = ['label', 'filename',
        'pageType', 'pageNumber', 'pageIndex', 'pagePosition', 'model',
        'pid', 'owner', 'created', 'modified', 'status'];

    public colsEditingRepo: { [model: string]: { field: string, selected: boolean, width: number }[] };

    public searchColumns: { field: string, selected: boolean; }[];
    public searchColumnsTree: { field: string, selected: boolean; }[];


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
            Object.assign(this.searchColumns, this.selectedColumnsSearchDefault);
        }
    }

    getSearchColumnsTree() {
        const prop = this.getStringProperty('searchColumnsTree');
        if (prop) {
            this.searchColumnsTree = [];
            Object.assign(this.searchColumnsTree, JSON.parse(prop));
        } else {
            this.searchColumnsTree = [];
            Object.assign(this.searchColumnsTree, this.selectedColumnsSearchDefault);
        }
    }

    setSelectedColumnsSearch() {
        this.setStringProperty('searchColumns', JSON.stringify(this.searchColumns));
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

    getColsEditingRepo() {
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
                        selected: true,
                        width: 100
                    }
                });
            })
        }
        return this.colsEditingRepo;
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
                    width: 100
                }
            });

            // Remove first, label
            ret.shift();
        }
        return ret;
    }

    setColumnsEditingRepo() {
        this.setStringProperty('colsRepo', JSON.stringify(this.colsEditingRepo));
    }

}
