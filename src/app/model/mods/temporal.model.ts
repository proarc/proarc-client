import { ElementField } from './elementField.model';
import { ModsRole } from './role.model';
import { ModsElement } from './element.model';
import ModsUtils from './utils';
import {ModsFrequency} from './frequency.model';
import {ModsNamePart} from './namePart.model';

export class ModsTemporal extends ModsElement {

    static getSelector() {
        return 'temporal';
    }

    static getId() {
        return 'temporal';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['lang', 'valueURI']);
        this.init();
    }


    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('lang');
      this.addControl('valueURI');

    }

}
