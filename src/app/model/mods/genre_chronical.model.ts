import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsGenreChronical extends ModsElement {

    static getSelector() {
        return 'genre';
    }

    static getId() {
        return 'genre_chronical';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'lang']);
        this.init();
    }

    private init() {
      if (!this.modsElement['_']) {
        this.modsElement['_'] = ModsUtils.getDefaultValue(this, 'value');
      }
      this.addControl('value', '_');
      this.addControl('type');
      this.addControl('lang');
    }
}
