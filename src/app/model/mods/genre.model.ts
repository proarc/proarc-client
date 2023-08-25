import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsGenre extends ModsElement {

    static getSelector() {
        return 'genre';
    }

    static getId() {
        return 'genre';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority', 'type', 'lang']);
        this.init();
    }

    private init() {
        const c = this.getControl('peer-reviewed');
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
    }

}
