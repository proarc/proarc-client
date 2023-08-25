import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsFrequency extends ModsElement {

    static getSelector() {
        return 'frequency';
    }

    static getId() {
        return 'frequency';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }


}
