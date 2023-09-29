import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsNamePart extends ModsElement {

    public namePart: any;

    static getSelector() {
        return 'namePart';
    }

    static getId() {
        return 'namePart';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      
      this.addControl('value');
      this.addControl('type');
    }

}
