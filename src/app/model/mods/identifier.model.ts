import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsIdentifier extends ModsElement {

    static getSelector() {
        return 'identifier';
    }

    static getId() {
        return 'identifier';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'typeURI', 'invalid']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('type');
      this.addControl('validity');
      this.addControl('typeURI');
    }

}
