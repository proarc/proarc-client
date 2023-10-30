import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDateCaptured extends ModsElement {

    static getSelector() {
        return 'dateCaptured';
    }

    static getId() {
        return 'dateCaptured';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['lang']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value');
      this.addControl('lang');

    }


}
