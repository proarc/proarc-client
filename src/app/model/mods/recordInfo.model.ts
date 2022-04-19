import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import {ModsRecordContentSource} from './recordContentSource.model';
import {ModsRecordCreationDate} from './recordCreationDate.model';
import {ModsRecordChangeDate} from './recordChangeDate.model';
import {ModsRecordIdentifier} from './recordIdentifier.model';

export class ModsRecordInfo extends ModsElement {

    descriptionStandard;
    recordOrigin;
    recordContectSources: ElementField;
    recordCreationDates: ElementField;
    recordChangeDates: ElementField;
    recordIdentifiers: ElementField;

    static getSelector() {
        return 'recordInfo';
    }

    static getId() {
        return 'recordInfo';
    }

    constructor(modsElement, template) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['descriptionStandard']) {
            this.modsElement['descriptionStandard'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['recordOrigin']) {
            this.modsElement['recordOrigin'] = ModsUtils.createEmptyField();
        }
        this.descriptionStandard = this.modsElement['descriptionStandard'][0];
        this.recordOrigin = this.modsElement['recordOrigin'][0];
        if (this.available('recordContectSource')) {
            this.recordContectSources = new ElementField(this.modsElement, ModsRecordContentSource.getSelector(), this.getField('recordContectSource'));
            this.addSubfield(this.recordContectSources);
        }
        if (this.available('recordCreationDate')) {
            this.recordCreationDates = new ElementField(this.modsElement, ModsRecordCreationDate.getSelector(), this.getField('recordCreationDate'));
            this.addSubfield(this.recordCreationDates);
        }
        if (this.available('recordChangeDate')) {
            this.recordChangeDates = new ElementField(this.modsElement, ModsRecordChangeDate.getSelector(), this.getField('recordChangeDate'));
            this.addSubfield(this.recordChangeDates);
        }
        if (this.available('recordIdentifier')) {
            this.recordIdentifiers = new ElementField(this.modsElement, ModsRecordIdentifier.getSelector(), this.getField('recordIdentifier'));
            this.addSubfield(this.recordIdentifiers);
        }
    }
}
