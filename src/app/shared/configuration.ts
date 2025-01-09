import { Injectable } from "@angular/core";
import json5 from "json5";


export interface TableColumn {
  field: string,
  selected: boolean,
  width: number,
  type: string // 'string' | 'translated' | 'date' | 'datetime' | 'boolean' 
}

@Injectable()
export class Configuration {

  // proarcUrl: "http://proarc.inovatika.dev/api",
  //   proarcUrl: "/api",
  //   ga: "UA-159265713-1",
  exports: string[];
  organizations: string[];
  models: string[];
  defaultModel: string;
  showCommentEditor: boolean;
  showWorkflow: boolean;
  showLogoutCounter: boolean;
  topPageTypes: string[];
  topLanguages: string[];
  languages: string[];
  topLocations: string[];
  identifiers: string[];
  pagePositions: string[];
  lang: string[];
  expandedModels: string[];
  showFooter: boolean;

  roleCodes: string[];
  updateInSource: boolean;
  updateInSourceModels: string[];

  searchExpandTree: boolean;

  navbarColor: string;
  workflowUrl: string;

  public valueMap: { mapId: string, values: any[] }[];

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

  [key: string]: any; // This is to allow property asignement by name this[k] = o[k];

  fromJSON5(json: string) {

  }

  mergeConfig(c: any) {
    const o = json5.parse(c);
    const keys = Object.keys(o);
    keys.forEach(k => {
      this[k] = o[k];
    });
  }
}