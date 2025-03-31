import { Injectable } from "@angular/core";
import json5 from "json5";
declare var APP_GLOBAL: {proarcUrl: string};


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
  proarcUrl = APP_GLOBAL.proarcUrl;

  //Theme properties
  primaryColor: string;
  darkTheme: boolean;
  accentColor: string;
  cssVars: {name: string, value: string}[];

  exports: string[];
  organizations: string[];
  models: string[];
  defaultModel: string;
  showCommentEditor: boolean;
  showWorkflow: boolean;
  showLogoutCounter: boolean;
  topPageTypes: string[];
  pageTypes: string[];
  topLanguages: string[];
  languages: string[];
  topLocations: string[];
  identifiers: string[];
  topIdentifiers: string[];
  pagePositions: string[];
  chronicleIdentifiers: string[];
  oldprintIdentifiers: string[];
  eDocumentIdentifiers: string[];
  musicDocumentIdentifiers: string[];

  donators: string[];

  lang: string[];
  expandedModels: string[];
  showFooter: boolean;

  roleCodes: string[];
  updateInSource: boolean;
  updateInSourceModels: string[];

  searchExpandTree: boolean;

  navbarColor: string;
  workflowUrl: string;

  // origin = model nad kterym to lze spustit
  // originModel = vychozi model z ktereho se prevadi
  // model = model na ktery se prevadi
  modelChanges: {origin: string, dest:{model: string, originmodel: string, apiPoint: string }[]}[];

  showPageIndex: boolean;
  showPageIdentifiers: boolean;

  allowedCopyModels: string[];

  profiles: string[];

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

  getIdentifiers(model: string): any[] {
    return this.isChronicle(model) ? this.chronicleIdentifiers :
      this.isOldprint(model) ? this.oldprintIdentifiers :
        this.canContainPdf(model) ? this.eDocumentIdentifiers :
          this.isMusicDocument(model) ? this.musicDocumentIdentifiers :
            this.identifiers;
  }

  public isPage(model: string): boolean {
    return model === 'model:page' || model === 'model:ndkpage' || model === 'model:oldprintpage';
  }

  public isAudioPage(model: string): boolean {
    return model == 'model:ndkaudiopage';
  }

  public isMusicDocument(model: string): boolean {
    return model === 'model:ndkphonographcylinder' || model === 'model:ndkmusicdocument'
      || model === 'model:ndksong' || model === 'model:ndktrack' || model === 'ndkaudiopage';
  }

  // public isVolume(): boolean {
  //   return this.model === 'model:ndkperiodicalvolume';
  // }

  // public isIssue(): boolean {
  //   return this.model === 'model:ndkperiodicalissue';
  // }

  public isChronicle(model: string): boolean {
    return model === 'model:chroniclevolume' || model === 'model:chronicletitle' || model === 'model:chroniclesupplement';
  }

  public isOldprint(model: string): boolean {
    return model === 'model:oldprintvolume' || model === 'model:oldprintsheetmusic' || model === 'model:oldprintmap'
      || model === 'model:oldprintgraphics' || model === 'model:oldprintomnibusvolume' || model === 'model:oldprintchapter'
      || model === 'model:oldprintmonographtitle' || model === 'model:oldprintsupplement'
      || model === 'model:oldprintmonographunit';
  }

  // public isTopLevel(): boolean {
  //   return !this.isPage() && !this.isVolume() && !this.isIssue();
  // }

  public isBdm(model: string): boolean {
    return model === 'model:bdmarticle';
  }

  public canContainPdf(model: string): boolean {
    return [
      'model:ndkeperiodical',
      'model:ndkeperiodicalvolume',
      'model:ndkeperiodicalissue',
      'model:ndkeperiodicalsupplement',
      'model:ndkearticle',
      'model:ndkemonographtitle',
      'model:ndkemonographvolume',
      'model:ndkechapter',
      'model:bdmarticle'
    ].indexOf(model) >= 0;
  }

}