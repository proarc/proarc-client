import { ModsElement } from './element.model';
import {ElementField} from './elementField.model';
import {ModsPlaceTerm} from './placeTerm.model';

export class ModsPlace extends ModsElement {

  public placeTerms: ElementField;

    static getSelector() {
        return 'place';
    }

    static getId() {
        return 'place';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, []);
        this.init();
    }

    private init() {
      if (!this.modsElement['placeTerm']) {
        this.modsElement['placeTerm'] = [];
      }
      this.addControl('placeTerm');

      if (this.available("placeTerm")) {
        this.placeTerms = new ElementField(this.modsElement, ModsPlaceTerm.getSelector(), this.getField('placeTerm'));
        this.addSubfield(this.placeTerms);
      }
    }


}
