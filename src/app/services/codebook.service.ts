
import { Injectable } from '@angular/core';
import { Translator } from 'angular-translator';
import { ConfigService } from './config.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class CodebookService {

  collPrefix = {
    "PageTypes": "page_type",
    "Languages": "lang",
    "Identifiers": "identifier",
    "ChronicleIdentifiers": "identifier"
  }

  pageTypes: any[] = []
  languages: any[] = []
  identifiers: any[] = []
  chronicleIdentifiers: any[] = []

  titleTypeCodes = [
    'abbreviated',
    'translated',
    'alternative',
    'uniform'
  ];

  constructor(private translator: Translator, private config: ConfigService, private locals: LocalStorageService) {
    this.refreshAll();
    translator.languageChanged.subscribe(() => this.refreshAll());
  }

  refreshAll() {
    this.translator.waitForTranslation().then(() => {
      this.pageTypes = this.buildCollection('PageTypes');
      this.languages = this.buildCollection('Languages');
      this.identifiers = this.buildCollection('Identifiers');
      this.chronicleIdentifiers = this.buildCollection('ChronicleIdentifiers');
    });
  }

  getTopCodes(collection: string): string[] {
    let topCodes = [];
    const preferred = this.locals.getStringProperty('codebook.top.' + collection);
    const configured = this.config['top' + collection];
    if (preferred == "---") {
      return topCodes;
    }
    if (preferred) {
      topCodes = preferred.split(',,');
    } else if (configured) {
      topCodes = configured;
    }
    return topCodes;
  }

  getTopNames(collection: string): string[] {
    const prefix = this.collPrefix[collection];
    const names = this.getTopCodes(collection).map(code => this.translator.instant(`${prefix}.${code.toLowerCase()}`)) as string[];
    names.sort((a: any, b: any): number => {
      return  a.localeCompare(b);
    });
    return names;
  }

  private buildCollection(collection: string): any[] {
    const prefix = this.collPrefix[collection];
    const top = [];
    const others = [];
    const topCodes = this.getTopCodes(collection)
    for (const code of topCodes) {
      top.push({ code: code, name: this.translator.instant(`${prefix}.${code.toLowerCase()}`) });
    }
    top.sort((a: any, b: any): number => {
      return  a.name.localeCompare(b.name);
    });
    for (const code of this.config['other' + collection]) {
      if (topCodes.indexOf(code) < 0) {
        others.push({ code: code, name: this.translator.instant(`${prefix}.${code.toLowerCase()}`) });
      }
    }
    others.sort((a: any, b: any): number => {
      return  a.name.localeCompare(b.name);
    });
    return top.concat(others);
  }

  setNewTopsInCollection(collection, tops: string[]) {
    if (tops.length == 0){
      tops.push('---')
    }
    this.locals.setStringProperty('codebook.top.' + collection, tops.join(',,'));
    this.refreshAll();
  }

}
