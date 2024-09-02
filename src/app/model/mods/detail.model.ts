import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsDetail extends ModsElement {

    caption: any;
    number: any;

    static getSelector() {
        return 'detail';
    }

    static getId() {
        return 'detail';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'level']);
        this.init();
    }

    private init() {
      this.addControl('type');
      this.addControl('level');
      if (!this.modsElement['caption']) {
        this.modsElement['caption'] = ModsUtils.createField(this, 'caption');
      }
      this.addControl('caption');

      if (!this.modsElement['number']) {
        this.modsElement['number'] = ModsUtils.createField(this, 'number');
      }
      this.addControl('number');

      this.caption = this.modsElement['caption'][0];
      this.number = this.modsElement['number'][0];
    }
}
