import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsForm extends ModsElement {

    static getSelector() {
        return 'form';
    }

    static getId() {
        return 'form';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority', 'type']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value', '_');
      this.addControl('authority');
      this.addControl('type');
    }


}
