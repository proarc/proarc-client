import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsRecordIdentifier extends ModsElement {

    static getSelector() {
        return 'recordIdentifier';
    }

    static getId() {
        return 'recordIdentifier';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['source']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }


}
