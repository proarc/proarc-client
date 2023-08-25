import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsNote extends ModsElement {

    static getSelector() {
        return 'note';
    }

    static getId() {
        return 'note';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }

}
