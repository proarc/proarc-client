import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsEdition extends ModsElement {

    static getSelector() {
        return 'edition';
    }

    static getId() {
        return 'edition';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');

    }


}
