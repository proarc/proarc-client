
import { Injectable } from '@angular/core';
import { Translator } from 'angular-translator';
import { ConfigService } from './config.service';

@Injectable()
export class CodebookService {


  pageTypes: any[] = []
  languages: any[] = []

  identifierTypeCodes = [
    'barcode',
    'issn',
    'isbn',
    'isbn',
    'ccnb',
    'uuid',
    'urnnbn',
    'oclc',
    'sysno',
    'permalink',
    'sici',
    'id',
    'localId'
  ];

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
      this.pageTypes = [];
      const otherPageTypes = [];
      for (const code of this.config.topPageTypes) {
        this.pageTypes.push({ code: code, name: this.translator.instant("page_type." + code.toLowerCase()) });
      }
      for (const code of this.config.pageTypes) {
        otherPageTypes.push({ code: code, name: this.translator.instant("page_type." + code.toLowerCase()) });
      }
      otherPageTypes.sort((a: any, b: any): number => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.pageTypes = this.pageTypes.concat(otherPageTypes);

      this.languages = [];
      const otherLanguages = [];
      for (const code of this.config.topLanguages) {
        this.languages.push({ code: code, name: this.translator.instant("lang." + code.toLowerCase()) });
      }
      for (const code of this.config.languages) {
        otherLanguages.push({ code: code, name: this.translator.instant("lang." + code.toLowerCase()) });
      }
      otherLanguages.sort((a: any, b: any): number => {
        return  a.name.localeCompare(b.name);
      });
      this.languages = this.languages.concat(otherLanguages);


    });
  }



}
