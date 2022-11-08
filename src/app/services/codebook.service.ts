
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './config.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class CodebookService {

  collPrefix: any = {
    "PageTypes": "page_type",
    "Languages": "lang",
    "Identifiers": "identifier",
    "Locations": "sigla",
    "ChronicleIdentifiers": "identifier",
    "EDocumentsIdentifiers": "identifier",
    "OldprintIdentifiers": "identifier"
  }

  pageTypes: any[] = [];
  languages: any[] = [];
  locations: any[] = [];
  identifiers: any[] = [];
  chronicleIdentifiers: any[] = [];
  eDocumentIdentifiers: any[] = [];
  oldprintIdentifiers : any[] = [];

  constructor(private translator: TranslateService, private config: ConfigService, private locals: LocalStorageService) {
    this.refreshAll();
    translator.onLangChange.subscribe(() => this.refreshAll());
  }

  refreshAll() {
    //this.translator.waitForTranslation().then(() => {
      this.pageTypes = this.buildCollection('PageTypes');
      this.languages = this.buildCollection('Languages');
      this.locations = this.buildCollection('Locations');
      this.identifiers = this.buildCollection('Identifiers');
      this.chronicleIdentifiers = this.buildCollection('ChronicleIdentifiers');
      this.eDocumentIdentifiers = this.buildCollection('EDocumentsIdentifiers');
      this.oldprintIdentifiers = this.buildCollection('OldprintIdentifiers');
    //});
  }

  getTopCodes(collection: string): string[] {
    let topCodes: any[] = [];
    const preferred = this.locals.getStringProperty('codebook.top.' + collection);
    const configured: any = this.config['top' + collection as keyof ConfigService];
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
    for (const code of this.config['other' + collection as keyof ConfigService]) {
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

  setNewTopsInCollection(collection: string, tops: string[]) {
    if (tops.length == 0){
      tops.push('---')
    }
    this.locals.setStringProperty('codebook.top.' + collection, tops.join(',,'));
    this.refreshAll();
  }


  getIdentifiers(model: string): any[] {
    return this.isChronicle(model) ? this.chronicleIdentifiers :
      this.isOldprint(model) ? this.oldprintIdentifiers :
      this.canContainPdf(model) ? this.eDocumentIdentifiers :
        this.identifiers;
  }

  public isPage(model: string): boolean {
    return model === 'model:page' || model === 'model:ndkpage' || model === 'model:oldprintpage';
  }

  public isAudioPage(model: string): boolean {
    return model == 'model:ndkaudiopage';
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
      || model === 'model:oldprintmonographtitle' || model === 'model:oldprintsupplement';
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
      'model:ndkearticle',
      'model:ndkemonographtitle',
      'model:ndkemonographvolume',
      'model:ndkechapter',
      'model:bdmarticle'
    ].indexOf(model) >= 0;
  }

}
