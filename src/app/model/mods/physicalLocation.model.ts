import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsPhysicalLocation extends ModsElement {

    static getSelector() {
        return 'physicalLocation';
    }

    static getId() {
        return 'physicalLocation';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority', 'displayLabel']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('authority');
      this.addControl('displayLabel');

    }

}
