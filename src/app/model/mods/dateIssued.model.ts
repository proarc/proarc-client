import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDateIssued extends ModsElement {

    static getSelector() {
        return 'dateIssued';
    }

    static getId() {
        return 'dateIssued';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['qualifier', 'encoding', 'point']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('qualifier');
      this.addControl('encoding');
      this.addControl('point');

    }


}
