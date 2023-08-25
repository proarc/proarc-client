import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsGeographicCode extends ModsElement {


    static getSelector() {
        return 'geographicCode';
    }

    static getId() {
        return 'geographicCode';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }

}
