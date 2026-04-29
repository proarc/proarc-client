import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsGeographic extends ModsElement {

    static getSelector() {
        return 'geographic';
    }

    static getId() {
        return 'geographic';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['valueURI']);
        this.init();
    }


    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value', '_');
      this.addControl('geographic');
      this.addControl('valueURI');

    }

}
