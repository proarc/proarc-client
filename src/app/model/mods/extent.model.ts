import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsExtent extends ModsElement {

    start: any;
    end: any;
    total: any;

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
        this.modsElement['start'] = ModsUtils.createField(this, 'start');
      }
      this.addControl('start');

      if (!this.modsElement['end']) {
        this.modsElement['end'] = ModsUtils.createField(this, 'end');
      }
      this.addControl('end');

      if (!this.modsElement['total']) {
        const attrs = {'type': 'pages'};
        this.modsElement['total'] = [ModsUtils.createTextElement('', attrs)];
        this.addControl('type');
      }
      this.addControl('total');

      this.start = this.modsElement['start'][0];
      this.end = this.modsElement['end'][0];
      this.total = this.modsElement['total'][0];

    }
}
