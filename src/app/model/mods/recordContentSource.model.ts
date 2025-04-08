import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsRecordContentSource extends ModsElement {

    static getSelector() {
        return 'recordContentSource';
    }

    static getId() {
        return 'recordContentSource';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value', '_');
      this.addControl('authority');
    }


}
