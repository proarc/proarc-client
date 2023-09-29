import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsForm } from './form.model';
import {ModsInternetMediaType} from './internetMediaType.model';
import {ModsPhysicalExtent} from './extentPhysical.model';

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
        this.addControl('displayLabel');
        if (!this.modsElement['extent']) {
            this.modsElement['extent'] = ModsUtils.createField(this, 'extent');
        }
        this.addControl('extent');
        
        if (!this.modsElement['note']) {
            this.modsElement['note'] = ModsUtils.createField(this, 'note');
        }
        this.addControl('note');
        
        if (!this.modsElement['digitalOrigin']) {
            this.modsElement['digitalOrigin'] = ModsUtils.createField(this, 'digitalOrigin');
        }
        this.addControl('digitalOrigin');

        this.note = this.modsElement['note'][0];
        this.digitalOrigin = this.modsElement['digitalOrigin'][0];

        if (this.available('internetMediaType')) {
          this.internetMediaTypes = new ElementField(this.modsElement, ModsInternetMediaType.getSelector(), this.getField('internetMediaType'));
          this.addSubfield(this.internetMediaTypes);
        }

        if (this.available('extent')) {
          this.extents = new ElementField(this.modsElement, ModsPhysicalExtent.getId(), this.getField('extent'));
          this.addSubfield(this.extents);
        }
        if(this.available('form')) {
            this.forms = new ElementField(this.modsElement, ModsForm.getSelector(), this.getField('form'));
            this.addSubfield(this.forms);
        }

    }


}
