import { parseString, processors, Builder } from 'xml2js';
import { ModsTitle } from './mods/title.model';
import { ElementField } from './mods/elementField.model';
declare var $: any;


export class DigitalDocument {

  public readonly uuid: string;
  public readonly original: string;

  private mods;

  public titles: ElementField;

  constructor(uuid: string, mods: string) {
    this.uuid = uuid;
    this.original = mods.trim();
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

  private extend() {
    for (let i = 1 ; i < arguments.length; i++) {
      for (const key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  }



}
