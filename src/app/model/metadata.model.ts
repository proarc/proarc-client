import { ModsVolume } from './mods/volume.model';
import { ModsGeo } from './mods/geo.model';
import { ModsPublisher } from './mods/publisher.model';
import { ModsLanguage } from './mods/language.model';
import { parseString, processors, Builder } from 'xml2js';
import { ModsTitle } from './mods/title.model';
import { ElementField } from './mods/elementField.model';
import { ModsAuthor } from './mods/author.model';
import { ModsLocation } from './mods/location.model';
import { ModsIdentifier } from './mods/identifier.model';
import { ModsNote } from './mods/note.mode';
import { Mods } from './mods.model';
declare var $: any;


export class Metadata {

  public readonly pid: string;
  public readonly timestamp: number = -1;
  public readonly originalMods: string;
  private mods;
  public readonly model: string;

  public volume: ModsVolume;

  private selectors = [
    ModsTitle.getSelector(),
    ModsAuthor.getSelector(),
    ModsPublisher.getSelector(),
    ModsLocation.getSelector(),
    ModsLanguage.getSelector(),
    ModsIdentifier.getSelector(),
    ModsNote.getSelector(),
    ModsGeo.getSelector()
  ];

  private fields: Map<String, ElementField>;

  constructor(pid: string, model: string, mods: string, timestamp: number) {
    this.pid = pid;
    this.timestamp = timestamp;
    this.model = model;
    this.originalMods = mods.trim();
    // this.originalDc = dc.trim();
    // this.relations = relations;
    this.parseMods(mods);
  }

  public static fromMods(mods: Mods, model: string) {
    return new Metadata(mods.pid, model, mods.content, mods.timestamp);
  }

  public isVolume(): boolean {
    return this.model === 'model:ndkperiodicalvolume';
  }

  public isIssue(): boolean {
    return this.model === 'model:ndkperiodicalissue';
  }
  private parseMods(mods: string) {
    // console.log('mods', mods);
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
    this.mods = this.normalizedCopy();
    let root = null;
    const modsCollection = this.mods['modsCollection'];
    if (modsCollection) {
      modsCollection['$'] = {
        'xmlns': 'http://www.loc.gov/mods/v3'
      };
      if (!modsCollection['mods'][0]) {
        modsCollection['mods'][0] = {};
      }
      root = modsCollection['mods'][0];
    } else {
      this.mods['mods']['$'] = {
        'xmlns': 'http://www.loc.gov/mods/v3'
      };
      root = this.mods['mods'];
    }
    if (this.isVolume() || this.isIssue()) {
      this.volume = new ModsVolume(root);
    } else {
      for (const selector of this.selectors) {
        if (selector === ModsGeo.getSelector()) {
          this.fields.set(selector, new ElementField(root, selector, 'authority', ['geo:origin', 'geo:storage', 'geo:area']));
        } else {
          this.fields.set(selector, new ElementField(root, selector));
        }
      }
    }
  }

  toJson() {
    return JSON.stringify(this.mods, null, 2);
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
    const mods = $.extend(true, {}, this.mods);
    const root = mods['modsCollection'] ? mods['modsCollection']['mods'][0] : mods['mods'];
    if (this.isVolume() || this.isIssue()) {

    } else {
      for (const selector of this.selectors) {
        this.normalizeField(root, selector);
      }
    }
    return mods;
  }

  private normalizeField(root, name) {
    if (this.normalize(root[name])) {
      delete root[name];
    }
  }

  private normalize(el) {
    if (el === null || el === undefined) {
      return true;
    }
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
    if (typeof el === 'string') {
      if (el === "") {
        return true;
      } else {
        return false;
      }
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
