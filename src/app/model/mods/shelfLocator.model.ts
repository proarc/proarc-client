import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsShelfLocator extends ModsElement {

    static getSelector() {
        return 'shelfLocator';
    }

    static getId() {
        return 'shelfLocator';
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
