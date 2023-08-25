import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsClassification extends ModsElement {

    static getSelector() {
        return 'classification';
    }

    static getId() {
        return 'classification';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority', 'edition']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }


}
