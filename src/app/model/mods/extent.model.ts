import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsExtent extends ModsElement {

    start: any;
    end: any;

    static getSelector() {
        return 'extent';
    }

    static getId() {
        return 'extent';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
      if (!this.modsElement['start']) {
        this.modsElement['start'] = ModsUtils.createEmptyField();
      }

      if (!this.modsElement['end']) {
        this.modsElement['end'] = ModsUtils.createEmptyField();
      }

      this.start = this.modsElement['start'][0];
      this.end = this.modsElement['end'][0];
    }
}
