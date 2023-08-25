import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsResource extends ModsElement {

    static getSelector() {
        return 'typeOfResource';
    }

    static getId() {
        return 'typeOfResource';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['manuscript']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }
}
