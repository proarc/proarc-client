import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDateModified extends ModsElement {

    static getSelector() {
        return 'dateModified';
    }

    static getId() {
        return 'dateModified';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['lang']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }


}
