
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
    "Locations": "sigla",
    "ChronicleIdentifiers": "identifier"
  }

  pageTypes: any[] = [];
  languages: any[] = [];
  locations: any[] = [];
  identifiers: any[] = [];
  chronicleIdentifiers: any[] = [];
  
  constructor(private translator: Translator, private config: ConfigService, private locals: LocalStorageService) {
    this.refreshAll();
    translator.languageChanged.subscribe(() => this.refreshAll());
  }

  refreshAll() {
    this.translator.waitForTranslation().then(() => {
      this.pageTypes = this.buildCollection('PageTypes');
      this.languages = this.buildCollection('Languages');
      this.locations = this.buildCollection('Locations');
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
    const names = this.getTopCodes(collection).map(code => this.tName(code, collection));
    names.sort((a: any, b: any): number => {
      return  a.localeCompare(b);
    });
    return names;
  }

  private buildCollection(collection: string): any[] {
    const top = [];
    const others = [];
    const topCodes = this.getTopCodes(collection)
    for (const code of topCodes) {
      top.push({ code: code, name: this.tName(code, collection) });
    }
    top.sort((a: any, b: any): number => {
      return  a.name.localeCompare(b.name);
    });
    for (const code of this.config['other' + collection]) {
      if (topCodes.indexOf(code) < 0) {
        others.push({ code: code, name: this.tName(code, collection) });
      }
    }
    others.sort((a: any, b: any): number => {
      return  a.name.localeCompare(b.name);
    });
    return top.concat(others);
  }

  tName(code: string, collection: string): string {
    let key = this.collPrefix[collection];;
    if (collection == "Locations") {
      key += '.' + code.toUpperCase();
    } else {
      key += '.' + code.toLocaleLowerCase();
    }
    return this.translator.instant(key) as string;
  }

  setNewTopsInCollection(collection, tops: string[]) {
    if (tops.length == 0){
      tops.push('---')
    }
    this.locals.setStringProperty('codebook.top.' + collection, tops.join(',,'));
    this.refreshAll();
  }

}
