import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsRecordCreationDate extends ModsElement {

    static getSelector() {
        return 'recordCreationDate';
    }

    static getId() {
        return 'recordCreationDate';
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
