import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsForm } from './form.model';

export class ModsPhysical extends ModsElement {

    note;
    extent;
    forms: ElementField;

    static getSelector() {
        return 'physicalDescription';
    }

    static getId() {
        return 'physicalDescription';
    }

    constructor(modsElement, template) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['extent']) {
            this.modsElement['extent'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['note']) {
            this.modsElement['note'] = ModsUtils.createEmptyField();
        }
        this.extent = this.modsElement['extent'][0];
        this.note = this.modsElement['note'][0];
        if(this.available('form')) {
            this.forms = new ElementField(this.modsElement, ModsForm.getSelector(), this.getField('form'));
            this.addSubfield(this.forms);
        }

    }


}
