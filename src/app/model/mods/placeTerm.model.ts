import { ModsElement } from './element.model';
import {ElementField} from './elementField.model';
import ModsUtils from './utils';

export class ModsPlaceTerm extends ModsElement {


    static getSelector() {
        return 'placeTerm';
    }

    static getId() {
        return 'placeTerm';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'authority']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }


}
