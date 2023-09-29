import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsPhysicalExtent extends ModsElement {

    static getSelector() {
        return 'extent';
    }

    static getId() {
        return 'extent_physical';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['unit', 'lang']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('unit');
      this.addControl('lang');
    }
}
