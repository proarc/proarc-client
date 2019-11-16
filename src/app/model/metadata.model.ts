import { ModsPublisher } from './mods/publisher.model';
import { ModsLanguage } from './mods/language.model';
import { parseString, processors, Builder } from 'xml2js';
import { ModsTitle } from './mods/title.model';
import { ElementField } from './mods/elementField.model';
import { ModsAuthor } from './mods/author.model';
import { ModsLocation } from './mods/location.model';
import { ModsIdentifier } from './mods/identifier.model';
import { ModsNote } from './mods/note.mode';
declare var $: any;


export class Metadata {

  public readonly pid: string;
  public readonly timestamp: number = -1;
  public readonly originalMods: string;
  public readonly originalDc: string;
  private mods;

  private selectors = [
    ModsTitle.getSelector(),
    ModsAuthor.getSelector(),
    ModsPublisher.getSelector(),
    ModsLocation.getSelector(),
    ModsLanguage.getSelector(),
    ModsIdentifier.getSelector(),
    ModsNote.getSelector()
  ];

  private fields: Map<String, ElementField>;

  constructor(pid: string, mods: string, timestamp: number) {
    this.pid = pid;
    this.timestamp = timestamp;
    this.originalMods = mods.trim();
    // this.originalDc = dc.trim();
    // this.relations = relations;
    this.parseMods(mods);
  }

  private parseMods(mods: string) {
    console.log('mods', mods);
    const xml = mods.replace(/xmlns.*=".*"/g, '');
    const data = {tagNameProcessors: [processors.stripPrefix], explicitCharkey: true};
    const ctx = this;
    parseString(xml, data, function (err, result) {
        ctx.processMods(result);
    });
  }


  private processMods(data) {
    this.fields = new Map<String, ElementField>();
    this.mods = data;
    console.log(data);
    // return;
    let root = null;
    const modsCollection = data['modsCollection'];
    if (modsCollection) {
      modsCollection['$'] = {
        'xmlns': 'http://www.loc.gov/mods/v3'
      };
      if (!modsCollection['mods'][0]) {
        modsCollection['mods'][0] = {};
      }
      root = modsCollection['mods'][0];
    } else {
      data['mods']['$'] = {
        'xmlns': 'http://www.loc.gov/mods/v3'
      };
      root = data['mods'];
      console.log('root', root);
    }
    for (const selector of this.selectors) {
      this.fields.set(selector, new ElementField(root, selector));
    }
    console.log('this.fields', this.fields);
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
    for (const selector of this.selectors) {
      dc += this.fields.get(selector).toDC();
    }
    dc += '</oai_dc:dc>';
    return dc;
}

  toMods(save: boolean = false) {
    const builder = new Builder({ 'headless': true });
    const xml = builder.buildObject(this.normalizedCopy(save));
    return xml;
  }

  getField(selector: string): ElementField {
    return this.fields.get(selector);
  }


  private normalizedCopy(final: boolean = false) {
    // const mods = Object.assign({}, this.mods);
    const mods = $.extend(true, {}, this.mods);
    const root = mods['modsCollection'] ? mods['modsCollection']['mods'][0] : mods['mods'];
    for (const selector of this.selectors) {
      this.normalizeField(root, selector);
    }
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
