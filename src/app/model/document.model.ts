import { parseString, processors, Builder } from 'xml2js';
import { ModsTitle } from './mods/title.model';
import { ElementField } from './mods/elementField.model';


export class DigitalDocument {

  public readonly uuid: string;
  public readonly original: string;

  private data;

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
    this.data = data;
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

}

