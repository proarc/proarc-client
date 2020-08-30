
import { Injectable } from '@angular/core';
import { Translator } from 'angular-translator';
import { ConfigService } from './config.service';

@Injectable()
export class CodebookService {

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

  constructor(private translator: Translator, private config: ConfigService) {
    this.refreshAll();
    translator.languageChanged.subscribe(() => this.refreshAll());
  }

  refreshAll() {
    this.translator.waitForTranslation().then(() => {
      this.pageTypes = this.buildCollection('PageTypes', 'page_type');
      this.languages = this.buildCollection('Languages', 'lang');
      this.identifiers = this.buildCollection('Identifiers', 'identifier');
      this.chronicleIdentifiers = this.buildCollection('ChronicleIdentifiers', 'identifier');
    });
  }

  private buildCollection(collection: string, prefix: string): any[] {
    const top = [];
    const others = [];
    for (const code of this.config['top' + collection]) {
      top.push({ code: code, name: this.translator.instant(`${prefix}.${code.toLowerCase()}`) });
    }
    for (const code of this.config['other' + collection]) {
      others.push({ code: code, name: this.translator.instant(`${prefix}.${code.toLowerCase()}`) });
    }
    others.sort((a: any, b: any): number => {
      return  a.name.localeCompare(b.name);
    });
    return top.concat(others);
  }

}
