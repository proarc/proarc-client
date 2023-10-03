import { ModsElement } from './element.model';
import ModsUtils from './utils';
import { ElementField } from './elementField.model';
import { ModsUrl } from './url.model';
import { ModsShelfLocator } from './shelfLocator.model';
import { ModsPhysicalLocation } from './physicalLocation.model';

export class ModsLocation extends ModsElement {

  public physicalLocations: ElementField;
  public urls: ElementField;
  public shelfLocators: ElementField;

  static getSelector() {
    return 'location';
  }

  static getId() {
    return 'location';
  }

  constructor(modsElement: any, template: any) {
    super(modsElement, template);
    this.init();
  }

  private init() {
    if (this.available2('physicalLocation')) {
      this.physicalLocations = new ElementField(this.modsElement, ModsPhysicalLocation.getSelector(), this.getField('physicalLocation'));
      this.addSubfield(this.physicalLocations);
    }
    this.addControl('physicalLocation');

    if (this.available2('url')) {
      this.urls = new ElementField(this.modsElement, ModsUrl.getSelector(), this.getField('url'));
      this.addSubfield(this.urls);
    }
    this.addControl('url');


    if (this.available2('shelfLocator')) {
      this.shelfLocators = new ElementField(this.modsElement, ModsShelfLocator.getSelector(), this.getField('shelfLocator'));
      this.addSubfield(this.shelfLocators);
    }
    this.addControl('shelfLocator');


  }

}
