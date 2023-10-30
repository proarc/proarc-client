import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsUrl extends ModsElement {

    static getSelector() {
        return 'url';
    }

    static getId() {
        return 'url';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['usage', 'note']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('usage');
      this.addControl('note');

    }


}
