import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsForm } from './form.model';
import {ModsInternetMediaType} from './internetMediaType.model';
import {ModsPhysicalExtent} from './extentPhysical.model';
import { ModsNote } from './note.mode';

export class ModsPhysical extends ModsElement {

    notes: ElementField;
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

        if (this.available2('note')) {
            this.notes = new ElementField(this.modsElement, ModsNote.getSelector(), this.getField('note'));
            this.addSubfield(this.notes);
            this.addControl('notes');
        }

        if (!this.modsElement['digitalOrigin']) {
            this.modsElement['digitalOrigin'] = ModsUtils.createField(this, 'digitalOrigin');
        }
        this.digitalOrigin = this.modsElement['digitalOrigin'][0];
        this.addControl('digitalOrigin');


        if (this.available2('internetMediaType')) {
          this.internetMediaTypes = new ElementField(this.modsElement, ModsInternetMediaType.getSelector(), this.getField('internetMediaType'));
          this.addSubfield(this.internetMediaTypes);
        this.addControl('internetMediaTypes');
        }

        if (this.available2('extent')) {
          this.extents = new ElementField(this.modsElement, ModsPhysicalExtent.getId(), this.getField('extent'), null, ModsPhysicalExtent.getSelector());
          this.addSubfield(this.extents);
          this.addControl('extents');
        }

        if(this.available2('form')) {
            this.forms = new ElementField(this.modsElement, ModsForm.getSelector(), this.getField('form'));
            this.addSubfield(this.forms);
            this.addControl('forms');
        }

    }


}
