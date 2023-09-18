import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDateValid extends ModsElement {

    static getSelector() {
        return 'dateValid';
    }

    static getId() {
        return 'dateValid';
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
