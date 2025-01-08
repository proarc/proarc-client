import { Injectable } from "@angular/core";
import json5 from "json5";

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