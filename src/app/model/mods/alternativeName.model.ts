import { ElementField } from './elementField.model';
import { ModsElement } from './element.model';
import {ModsNamePart} from './namePart.model';

export class ModsAlternativeName extends ModsElement {

    public nameParts: ElementField;

    static getSelector() {
        return 'alternativeName';
    }

    static getId() {
        return 'alternativeName';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, []);
        this.init();
    }

    private init() {
      if (!this.modsElement['namePart']) {
        this.modsElement['namePart'] = [];
      }
      this.nameParts = new ElementField(this.modsElement, ModsNamePart.getSelector(), this.getField('namePart'));
      this.addSubfield(this.nameParts);
      this.addControl('namePart');
    }
}


