import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDateOther extends ModsElement {

    static getSelector() {
        return 'dateOther';
    }

    static getId() {
        return 'dateOther';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }


}
