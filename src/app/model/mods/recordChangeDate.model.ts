import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsRecordChangeDate extends ModsElement {

    static getSelector() {
        return 'recordChangeDate';
    }

    static getId() {
        return 'recordChangeDate';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['encoding']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('encoding');
    }


}
