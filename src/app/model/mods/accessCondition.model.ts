import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsAccessCondition extends ModsElement {

    static getSelector() {
        return 'accessCondition';
    }

    static getId() {
        return 'accessCondition';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'displayLabel', 'xlink:href']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('type');
      this.addControl('xlink:href');
      this.addControl('displayLabel');
    }

}
