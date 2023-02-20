// import { ModsVolume } from './mods/volume.model';
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
import { ModsAbstract } from './mods/abstract.model';
import { ModsChronicleLocation } from './mods/chronicle_location.model';
import { ProArc } from '../utils/proarc';
import { ModsPhysical } from './mods/physical.model';
import { ModsSubject } from './mods/subject.model';
import { ModsGenre } from './mods/genre.model';
import { ModsGenreChronical } from './mods/genre_chronical.model';
import { ModsClassification } from './mods/classification.model';
import { ModsResource } from './mods/resource.model';
import { ModelTemplate } from '../templates/modelTemplate';
import { ModsPart } from './mods/part.model';
import { ModsRecordInfo } from './mods/recordInfo.model';
import { ModsTableOfContents } from './mods/tableOfContents';
import { ModsRelatedItem } from './mods/relatedItem.model';
declare var $: any;

import * as JSON5 from 'json5';
// import * as JSON6 from 'json-6';
// declare var JSON6: any;

export class Metadata {

  private static selectors = [
    ModsTitle.getSelector(),
    ModsAuthor.getSelector(),
    ModsPublisher.getSelector(),
    ModsLocation.getSelector(),
    ModsLanguage.getSelector(),
    ModsIdentifier.getSelector(),
    ModsNote.getSelector(),
    ModsAbstract.getSelector(),
    ModsGenre.getSelector(),
    ModsClassification.getSelector(),
    ModsSubject.getSelector(),
    ModsPhysical.getSelector(),
    ModsRecordInfo.getSelector(),
    ModsRelatedItem.getSelector(),
    ModsResource.getSelector(),
    ModsPart.getSelector(),
    ModsTableOfContents.getSelector()
  ];


  public readonly pid: string;
  public timestamp: number = -1;
  public readonly originalMods: string;
  private mods: { [x: string]: any; };
  public readonly model: string;

  // public volume: ModsVolume;

  private fieldsIds: string[];

  private fields: Map<String, ElementField>;

  public template: { [x: string]: boolean; };
  public standard: string;

  constructor(pid: string, model: string, mods: string, timestamp: number, standard: string, template: any = null) {
    this.pid = pid;
    this.timestamp = timestamp;
    this.standard = standard;
    this.model = model;
    this.template = template;
    if (localStorage.getItem('expandedModels')) {
      localStorage.setItem('metadata.allExpanded', JSON.parse(localStorage.getItem('expandedModels').includes(model).toString()));
    }
    
    this.originalMods = mods.trim();
    // this.originalDc = dc.trim();
    // this.relations = relations;
    this.parseMods(mods);
  }


  public static fromMods(mods: Mods, model: string) {
    return new Metadata(mods.pid, model, mods.content, mods.timestamp, null, null);
  }

  // public isVolume(): boolean {
  //   return this.model === 'model:ndkperiodicalvolume';
  // }

  // public isIssue(): boolean {
  //   return this.model === 'model:ndkperiodicalissue';
  // }

  private parseMods(mods: string) {
    const xml = mods.replace(/xmlns.*=".*"/g, '');
    const data = { tagNameProcessors: [processors.stripPrefix], explicitCharkey: true };
    const ctx = this;
    parseString(xml, data, function (err: any, result: any) {
      ctx.processMods(result);
    });
  }

  validate(): boolean {
    let valid = true;
    for (const id of this.fieldsIds) {
      const f = this.fields.get(id);
      for (const item of f.getItems()) {
        if (!item.validate()) {
          valid = false;
          //if (item.collapsed) {
          item.collapsed = false;
          //}
        }
        for (const subfield of item.getSubfields()) {
          for (const item2 of subfield.getItems()) {
            if (!item2.validate()) {
              valid = false;
              //if (item2.collapsed) {
              item2.collapsed = false;
              item.collapsed = false;
              //}
            }
          }
        }
      }
    }
    return valid;
  }

  expandRequired(): boolean {
    let valid = true;
    for (const id of this.fieldsIds) {
      const f = this.fields.get(id);
      for (const item of f.getItems()) {
        if (item.isRequired()) {
          item.collapsed = false;
        }
        for (const subfield of item.getSubfields()) {
          for (const item2 of subfield.getItems()) {
            if (item2.isRequired()) {
              valid = false;
              item2.collapsed = false;
              item.collapsed = false;
            }
          }
        }
      }
    }
    return valid;
  }

  static resolveStandard(data: { [x: string]: any; }): string {
    let standard = '';
    let mods: any = data;
    if (data['modsCollection']) {
      if (data['modsCollection']['mods']) {
        mods = data['modsCollection']['mods'];
      } else {
        mods = data['modsCollection'][0]['mods'];
      }
    } else if (data['mods']) {
      mods = data['mods'];
    }
    if (mods.length) {
      mods = mods[0];
    }
    if (mods['recordInfo']) {
      for (const ri of mods['recordInfo']) {
        if (ri['descriptionStandard'] && ri['descriptionStandard'][0]) {
          standard = ri['descriptionStandard'][0]['_'] || '';
          break;
        }
      }
    }
    standard.trim();
    if (standard != 'aacr') {
      standard = 'rda'
    }
    return standard;
  }

  private processMods(data: any) {
    if (!this.standard) {
      this.standard = Metadata.resolveStandard(data);
    }

    // if (!this.template) {
    //   this.template = ModelTemplate.data[this.standard][this.model];
    // }
    
    if (!this.template) {
      return;
    }
    this.fieldsIds = [];
    const allIds = [
      ModsGeo.getId(),
      ModsTitle.getId(),
      ModsAuthor.getId(),
      ModsPublisher.getId(),
      ModsLocation.getId(),
      ModsLanguage.getId(),
      ModsSubject.getId(),
      ModsIdentifier.getId(),
      ModsNote.getId(),
      ModsAbstract.getId(),
      ModsGenre.getId(),
      ModsClassification.getId(),
      ModsPhysical.getId(),
      ModsResource.getId(),
      ModsPart.getId(),
      ModsRecordInfo.getId(),
      ModsRelatedItem.getId(),
      ModsTableOfContents.getId(),
    ];
    for (const id of allIds) {
      if (this.template[id]) {
        this.fieldsIds.push(id);
      }
    }

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
    // if (this.isVolume() || this.isIssue()) {
    //   this.volume = new ModsVolume(root);
    //   const id = "physicalDescription";
    //   this.fields.set(id, new ElementField(root, id, this.template[id]));
    // } else {
    for (const id of this.fieldsIds) {
      if (id === ModsGeo.getId()) {
        this.fields.set(id, new ElementField(root, id, this.template[id], 'authority', ['geo:origin', 'geo:storage', 'geo:area']));
      } else if (id === ModsIdentifier.getId() && ProArc.isChronicle(this.model)) {
        this.fields.set(id, new ElementField(root, id, this.template[id], 'type', ProArc.chronicleIdentifierTypes));
      } else if (id === ModsSubject.getId()) {
        this.fields.set(id, new ElementField(root, id, this.template[id], 'authority', [], ['geo:origin', 'geo:storage', 'geo:area']));
      } else {
        this.fields.set(id, new ElementField(root, id, this.template[id]));
      }
    }
    // }
  }

  toJson() {
    return JSON.stringify(this.mods, null, 2);
  }

  toMods(save: boolean = false) {
    const builder = new Builder({ 'headless': true });
    const xml = builder.buildObject(this.normalizedCopy(save));
    return xml;
  }

  getField(id: string): ElementField {
    return this.fields.get(id);
  }


  private normalizedCopy(final: boolean = false) {
    const mods = $.extend(true, {}, this.mods);
    const root = mods['modsCollection'] ? mods['modsCollection']['mods'][0] : mods['mods'];
    // if (this.isVolume() || this.isIssue()) {
    //   this.normalizeField(root, ModsPhysical.getSelector());
    // } else {
    if (this.fieldsIds.indexOf(ModsPublisher.getId()) >= 0) {
      const publishers = new ElementField(root, ModsPublisher.getSelector(), this.template[ModsPublisher.getSelector()]);
      publishers.update();
    }
    for (const selector of Metadata.selectors) {
      this.normalizeField(root, selector);
    }
    // }
    return mods;
  }

  private normalizeField(root: { [x: string]: any; }, name: string) {
    if (this.normalize(root[name])) {
      delete root[name];
    }
  }

  private normalize(el: any) {
    if (el === null || el === undefined) {
      return true;
    }
    if (el.hasOwnProperty('$')) {
      const attrs: any = el['$'];
      Object.keys(attrs).forEach(function (key) {
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
      Object.keys(el).forEach(function (key) {
        if (ctx.normalize(el[key])) {
          delete el[key];
        }
      });
      if (Object.keys(el).length < 1 || (Object.keys(el).length == 1 && el.hasOwnProperty('$'))) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  hasChanges(): boolean {
    for (const id of this.fieldsIds) {
      const f = this.fields.get(id);
      for (const item of f.getItems()) {

        if (item.hasChanges()) {
          return true;
        }
        for (const subfield of item.getSubfields()) {
          for (const item2 of subfield.getItems()) {

            if (item2.hasChanges()) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  resetChanges() {
    for (const id of this.fieldsIds) {
      const f = this.fields.get(id);
      for (const item of f.getItems()) {
        item.resetChanges();
        for (const subfield of item.getSubfields()) {
          for (const item2 of subfield.getItems()) {
            item2.resetChanges();
          }
        }
      }
    }
  }

}
