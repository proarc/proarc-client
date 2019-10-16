import { ModsPublisher } from './mods/publisher.model';
import { ModsLanguage } from './mods/language.model';
import { parseString, processors, Builder } from 'xml2js';
import { ModsTitle } from './mods/title.model';
import { ElementField } from './mods/elementField.model';
import { ModsAuthor } from './mods/author.model';
import { ModsLocation } from './mods/location.model';
import { ModsIdentifier } from './mods/identifier.model';
declare var $: any;


export class DigitalDocument {

  public readonly uuid: string;
  public readonly originalMods: string;
  public readonly originalDc: string;

  private mods;

  public titles: ElementField;
  public authors: ElementField;
  public publishers: ElementField;
  public locations: ElementField;
  public languages: ElementField;
  public identifiers: ElementField;

  constructor(uuid: string, mods: string, dc: string) {
    this.uuid = uuid;
    this.originalMods = mods.trim();
    this.originalDc = dc.trim();
    this.parseMods(mods);
  }

  private parseMods(mods: string) {
    const xml = mods.replace(/xmlns.*=".*"/g, '');
    const data = {tagNameProcessors: [processors.stripPrefix], explicitCharkey: true};
    const ctx = this;
    parseString(xml, data, function (err, result) {
        ctx.processMods(result);
    });
  }


  private processMods(data) {
    this.mods = data;
    const modsCollection = data['modsCollection'];
    modsCollection['$'] = {
      'xmlns': 'http://www.loc.gov/mods/v3'
    };
    if (!modsCollection['mods'][0]) {
      modsCollection['mods'][0] = {};
    }
    const root = modsCollection['mods'][0];

    this.titles = new ElementField(root, ModsTitle.getSelector());
    this.authors = new ElementField(root, ModsAuthor.getSelector());
    this.publishers = new ElementField(root, ModsPublisher.getSelector());
    this.locations = new ElementField(root, ModsLocation.getSelector());
    this.languages = new ElementField(root, ModsLanguage.getSelector());
    this.identifiers = new ElementField(root, ModsIdentifier.getSelector());

    console.log('identifiers', this.identifiers);

  }

  toJson() {
    return JSON.stringify(this.mods, null, 2);
  }

  toDc(): string {
    let dc = '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" '
           + 'xmlns:dc="http://purl.org/dc/elements/1.1/" '
           + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
           + 'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ '
           + 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\n';
    dc += this.titles.toDC();
    dc += this.authors.toDC();
    dc += this.publishers.toDC();
    dc += this.locations.toDC();
    dc += this.languages.toDC();
    dc += this.identifiers.toDC();
    dc += '</oai_dc:dc>';
    return dc;
}

  toMods(save: boolean = false) {
    const builder = new Builder({ 'headless': true });
    const xml = builder.buildObject(this.normalizedCopy(save));
    return xml;
  }




  private normalizedCopy(final: boolean = false) {

    // const mods = Object.assign({}, this.mods);
    const mods = $.extend(true, {}, this.mods);

    const root = mods['modsCollection']['mods'][0];

    this.normalizeField(root, ModsTitle.getSelector());
    this.normalizeField(root, ModsAuthor.getSelector());
    this.normalizeField(root, ModsPublisher.getSelector());
    this.normalizeField(root, ModsLocation.getSelector());
    this.normalizeField(root, ModsLanguage.getSelector());
    this.normalizeField(root, ModsIdentifier.getSelector());
    return mods;
  }

  private normalizeField(root, name) {
    if (this.normalize(root[name])) {
      delete root[name];
    }
  }

  private normalize(el) {
    if (el.hasOwnProperty('$')) {
      const attrs = el['$'];
      Object.keys(attrs).forEach(function(key) {
        if (attrs[key] === '') {
          delete attrs[key];
        }
      });
    }
    if (el.hasOwnProperty('_')) {
      if (el['_'] === '') {
        return true;
      } else {
        return false;
      }
    }
    if (el instanceof String) {
      return false;
    }
    if (el instanceof Array) {
      for (let index = el.length - 1; index >= 0; index--) {
        const item = el[index];
        if (this.normalize(item)) {
          el.splice(index, 1);
        }
      }
      if (el.length === 0) {
        return true;
      } else {
        return false;
      }
    }
    if (typeof el === 'object') {
      const ctx = this;
      // if (Object.keys(el).length === 1 && el['$']) {
      //   return true;
      // }
      Object.keys(el).forEach(function(key) {
        if (ctx.normalize(el[key])) {
          delete el[key];
        }
      });
      if (Object.keys(el).length < 1) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }



}
