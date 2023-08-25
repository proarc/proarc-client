import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsTableOfContents extends ModsElement {

    static getSelector() {
        return 'tableOfContents';
    }

    static getId() {
        return 'tableOfContents';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['displayLabel']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }
}
