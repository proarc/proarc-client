import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDateCreated extends ModsElement {

    static getSelector() {
        return 'dateCreated';
    }

    static getId() {
        return 'dateCreated';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['point']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('point');

    }


}
