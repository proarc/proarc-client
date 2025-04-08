import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsAbstract extends ModsElement {

    static getSelector() {
        return 'abstract';
    }

    static getId() {
        return 'abstract';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['lang']);
        this.init();
    }

    private init() {
      this.addControl('lang');
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value', '_');
      this.addControl('abstract', '_');
    }

}
