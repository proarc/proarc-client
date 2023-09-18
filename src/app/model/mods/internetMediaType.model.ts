import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsInternetMediaType extends ModsElement {

    static getSelector() {
        return 'internetMediaType';
    }

    static getId() {
        return 'internetMediaType';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }
}
