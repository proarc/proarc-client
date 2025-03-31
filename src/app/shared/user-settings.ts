import { Injectable } from "@angular/core";
import { Configuration, TableColumn } from "./configuration";
import { ApiService } from "../services/api.service";
import { Utils } from "../utils/utils";
import { UIService } from "../services/ui.service";
import { IConfig } from "../dialogs/layout-admin/layout-admin.component";

@Injectable()
export class UserSettings {

    searchModel: string; // Last model used in search
    searchOrganization: string; // Last organization used in search
    searchQueryField: string; // Last field used in search
    searchOwner: string; // Last field used in search
    searchProcessor: string; // Last processor used in search
    searchSortField: string;
    searchSortAsc: boolean;

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

    formHighlighting: boolean;

    repositoryLayout: IConfig;
    importLayout: IConfig;

    parentModel: string;  // model in parent-dialog
    parentOrganization: string; 
    parentQueryField: string; 
    parentOwner: string; 
    parentProcessor: string; 
    parentSortField: string;
    parentSortAsc: boolean;
    parentExpandedPath: string[];
    parentSplit: number = 60; // First split panel in parent-dialog.
    columnsParentRight: TableColumn[];
    columnsParentLeft: TableColumn[];

    viewerPositionLock: boolean;
    viewerRotation: string; 
    viewerCenter: string; 
    viewerResolution: string; 

    markSequenceDialogOrigTableColumns: TableColumn[];
    markSequenceDialogDestTableColumns: TableColumn[];

    [key: string]: any; // This is to allow property asignement by name this[k] = o[k];

}

@Injectable()
export class UserSettingsService {

    defaultLayoutConfig: IConfig = {
      columns: [
        {
          visible: true,
          size: 30,
          rows: [
            { id: 'panel1', visible: true, size: 50, type: 'structure-list', isDirty: false, canEdit: true },
            { id: 'panel2', visible: true, size: 50, type: 'mods', isDirty: false, canEdit: true },
          ],
        },
        {
          visible: true,
          size: 40,
          rows: [
            { id: 'panel3', visible: true, size: 20, type: 'structure-icons', isDirty: false, canEdit: true },
            { id: 'panel4', visible: false, size: 30, type: 'ocr', isDirty: false, canEdit: true },
            { id: 'panel5', visible: false, size: 50, type: 'comment', isDirty: false, canEdit: true },
          ],
        },
        {
          visible: true,
          size: 30,
          rows: [
            { id: 'panel6', visible: true, size: 40, type: 'image', isDirty: false, canEdit: true },
            { id: 'panel7', visible: true, size: 60, type: 'atm', isDirty: false, canEdit: true },
          ],
        },
      ],
      disabled: false,
    }
    

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
    { field: 'filename', selected: true, width: 100, type: 'string' },
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

public queueColumnsDefault: TableColumn[] = [
    { field: 'description', selected: true, width: 100, type: 'string' },
    { field: 'create', selected: true, width: 100, type: 'date' },
    { field: 'timestamp', selected: true, width: 100, type: 'datetime' },
    { field: 'state', selected: true, width: 100, type: 'string' },
    { field: 'pageCount', selected: true, width: 100, type: 'string' },
    { field: 'user', selected: true, width: 100, type: 'string' }
];

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
        this.save(true);
    }

    reset() {
        this.settings.searchModel = this.config.defaultModel;
        this.settings.searchOrganization = '-';
        this.settings.searchQueryField = 'queryLabel';
        this.settings.searchOwner = '-';
        this.settings.searchProcessor = '-';
        this.settings.searchSortField = 'modified';
        this.settings.searchSortAsc = false;
        this.settings.searchSplit = 60;
        this.settings.columnsSearch = Utils.clone(this.columnsSearchDefault);
        this.settings.columnsSearchTree = Utils.clone(this.columnsSearchDefault);
        this.settings.searchExpandTree = true;

        this.settings.colsEditingRepo = {};
        this.config.models.forEach((model: string) => {
            this.settings.colsEditingRepo[model] = Utils.clone(this.columnsEditingRepoDefault);
            // pro modely stranek zapneme jejich cols
            this.settings.colsEditingRepo[model].forEach(col => {
                col.selected = (model.indexOf('page') < 0 && col.field.indexOf('page') < 0) || (model.indexOf('page') > -1 && col.field.indexOf('page') > -1);
            });
        });
        this.settings.colsEditModeParent = true;

        this.settings.colsEditingImport = Utils.clone(this.columnsEditingRepoDefault);
        

        this.settings.columnsWorkFlow = Utils.clone(this.columnsWorkFlowDefault);
        this.settings.columnsWorkFlowTasks = Utils.clone(this.columnsWorkFlowTasksDefault);
        this.settings.procMngColumns = Utils.clone(this.procMngColumnsDefault);
        this.settings.queueColumns = Utils.clone(this.queueColumnsDefault);

        this.settings.topPageTypes = Utils.clone(this.config.topPageTypes);
        this.settings.topLanguages = Utils.clone(this.config.topLanguages);
        this.settings.topIdentifiers = Utils.clone(this.config.topIdentifiers);
        this.settings.topExpandedModels = Utils.clone(this.config.expandedModels);
        this.settings.formHighlighting = true;

        this.settings.repositoryLayout = Utils.clone(this.defaultLayoutConfig);
        this.settings.importLayout = Utils.clone(this.defaultLayoutConfig);
        this.settings.parentModel = this.config.defaultModel;
        this.settings.parentSortField = 'modified';
        this.settings.parentSortAsc = false;
        
        this.settings.parentQueryField = 'queryLabel';
        this.settings.parentOwner = '-';
        this.settings.parentProcessor = '-';
        this.settings.parentOrganization = '-';
        this.settings.parentExpandedPath = [];
        this.settings.parentSplit = 60;
        this.settings.columnsParentRight = Utils.clone(this.columnsSearchDefault);
        this.settings.columnsParentLeft = Utils.clone(this.columnsSearchDefault);

        
        this.settings.viewerPositionLock = false;
        this.settings.viewerRotation = null;
        this.settings.viewerCenter = null;
        this.settings.viewerResolution = null;

        this.settings.markSequenceDialogOrigTableColumns = Utils.clone(this.columnsSearchDefault);
        this.settings.markSequenceDialogDestTableColumns = Utils.clone(this.columnsSearchDefault);
    }

    load(o: any) {
        const keys = Object.keys(o);
        keys.forEach(k => {
            this.settings[k] = o[k];
        });
    }

    save(showInfo?: boolean) {
        // const keys = ['searchModel', 'columnsSearch', 'columnsSearchTree', 'colsEditingRepo', 'colsEditModeParent',
        //     'columnsWorkFlow', 'columnsWorkFlowTasks', 'procMngColumns', 'queueColumns'];
        // const toSave: any = {};
        // keys.forEach(k => {
        //     toSave[k] = this.settings[k];
        // });
        if (showInfo) {
          console.log(this.settings);
          this.ui.showInfo('snackbar.changeSaved');
        }
    }
}