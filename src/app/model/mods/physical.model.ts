import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsForm } from './form.model';
import {ModsExtent} from './extent.model';
import {ModsInternetMediaType} from './internetMediaType.model';

export class ModsPhysical extends ModsElement {

    note: any;
    digitalOrigin: any;
    forms: ElementField;
    extents : ElementField;
    internetMediaTypes: ElementField;

    static getSelector() {
        return 'physicalDescription';
    }

    static getId() {
        return 'physicalDescription';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['displayLabel']);
        this.init();
    }

    private init() {
        if (!this.modsElement['extent']) {
            this.modsElement['extent'] = ModsUtils.createField(this, 'extent');
        }
        if (!this.modsElement['note']) {
            this.modsElement['note'] = ModsUtils.createField(this, 'note');
        }
        if (!this.modsElement['digitalOrigin']) {
            this.modsElement['digitalOrigin'] = ModsUtils.createField(this, 'digitalOrigin');
        }
        this.note = this.modsElement['note'][0];
        this.digitalOrigin = this.modsElement['digitalOrigin'][0];

        if (this.available('internetMediaType')) {
          this.internetMediaTypes = new ElementField(this.modsElement, ModsInternetMediaType.getSelector(), this.getField('internetMediaType'));
          this.addSubfield(this.internetMediaTypes);
        }

        if (this.available('extent')) {
          this.extents = new ElementField(this.modsElement, ModsExtent.getSelector(), this.getField('extent'));
          this.addSubfield(this.extents);
        }
        if(this.available('form')) {
            this.forms = new ElementField(this.modsElement, ModsForm.getSelector(), this.getField('form'));
            this.addSubfield(this.forms);
        }

    }


}
