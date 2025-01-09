import { Injectable } from "@angular/core";
import { Configuration, TableColumn } from "./configuration";
import { ApiService } from "../services/api.service";
import { Utils } from "../utils/utils";
import { UIService } from "../services/ui.service";

@Injectable()
export class UserSettings {

    searchModel: string; // Last model used in search
    searchSplit: number = 60; // First split panel in search.

    columnsSearch: TableColumn[];
    columnsSearchTree: TableColumn[];
    searchExpandTree: boolean;
    colsEditingRepo: { [model: string]: TableColumn[] } = {};
    colsEditModeParent: boolean;
    
    colsEditingImport: TableColumn[];
    columnsWorkFlow: TableColumn[];
    columnsWorkFlowTasks: TableColumn[];
    procMngColumns: TableColumn[];
    queueColumns: TableColumn[];

    topPageTypes: string[];
    topLanguages: string[];
    topIdentifiers: string[];
    topExpandedModels: string[];
    

    [key: string]: any; // This is to allow property asignement by name this[k] = o[k];

}

@Injectable()
export class UserSettingsService {

    constructor(
        private api: ApiService,
        private ui: UIService,
        private config: Configuration,
        private settings: UserSettings) {
    }

    cloneSettings() {
        return Utils.clone(this.settings);
    }

    setSettings(o: UserSettings) {
        const keys = Object.keys(o);
        keys.forEach(k => {
            this.settings[k] = o[k];
        }); 
        this.save();
    }

    reset() {
        this.settings.searchModel = this.config.defaultModel;
        this.settings.searchSplit = 60;
        this.settings.columnsSearch = Utils.clone(this.config.columnsSearchDefault);
        this.settings.columnsSearchTree = Utils.clone(this.config.columnsSearchDefault);
        this.settings.searchExpandTree = true;

        this.settings.colsEditingRepo = {};
        this.config.models.forEach((model: string) => {
            this.settings.colsEditingRepo[model] = this.config.columnsEditingRepoDefault;
            // pro modely stranek zapneme jejich cols
            this.settings.colsEditingRepo[model].forEach(col => {
                col.selected = (model.indexOf('page') < 0 && col.field.indexOf('page') < 0) || (model.indexOf('page') > -1 && col.field.indexOf('page') > -1)
            });
        });
        this.settings.colsEditModeParent = true;

        this.settings.colsEditingImport = Utils.clone(this.config.columnsEditingRepoDefault);
        

        this.settings.columnsWorkFlow = Utils.clone(this.config.columnsWorkFlowDefault);
        this.settings.columnsWorkFlowTasks = Utils.clone(this.config.columnsWorkFlowTasksDefault);
        this.settings.procMngColumns = Utils.clone(this.config.procMngColumnsDefault);
        this.settings.queueColumns = Utils.clone(this.config.queueColumnsDefault);

        this.settings.topPageTypes = [];
        this.settings.topLanguages = [];
        this.settings.topIdentifiers = [];
        this.settings.topExpandedModels = [];
    }

    load(o: any) {
        const keys = Object.keys(o);
        keys.forEach(k => {
            this.settings[k] = o[k];
        });
    }

    save() {
        // const keys = ['searchModel', 'columnsSearch', 'columnsSearchTree', 'colsEditingRepo', 'colsEditModeParent',
        //     'columnsWorkFlow', 'columnsWorkFlowTasks', 'procMngColumns', 'queueColumns'];
        // const toSave: any = {};
        // keys.forEach(k => {
        //     toSave[k] = this.settings[k];
        // });
        // console.log(toSave);
        this.ui.showInfo('snackbar.changeSaved');
    }
}