import ModsUtils from './utils';
import { ModsElement } from './element.model';
import {ElementField} from './elementField.model';
import {ModsExtent} from './extent.model';

export class ModsPart extends ModsElement {

    type: any;
    caption: any;
    extents: ElementField;
    recordIdentifier: ElementField;

    static getSelector() {
        return 'part';
    }

    static getId() {
        return 'part';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
        if (!this.modsElement['type']) {
             this.modsElement['type'] = ModsUtils.createField(this, 'type');
        }
        if (!this.modsElement['detail']) {
            this.modsElement['detail'] = [];
        }
        this.type = this.modsElement['type'][0];
        const ctx = this;
        this.modsElement['detail'].forEach(function(caption: { [x: string]: any[]; }) {
          if (caption['caption'] && caption['caption'][0]) {
            ctx.caption = caption['caption'][0];
          }
        });
        if (!this.caption) {
          const caption = ModsUtils.createObjWithTextElement('caption', '', null);
          this.caption = caption['caption'][0];
          this.modsElement['detail'].push(caption);
        }

      if (this.available('extent')) {
        this.extents = new ElementField(this.modsElement, ModsExtent.getSelector(), this.getField('extent'));
        this.addSubfield(this.extents);
      }
    }
}
