import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import {ModsRecordContentSource} from './recordContentSource.model';
import {ModsRecordCreationDate} from './recordCreationDate.model';
import {ModsRecordChangeDate} from './recordChangeDate.model';
import {ModsRecordIdentifier} from './recordIdentifier.model';
import {ModsLanguageOfCataloging} from './languageOfCataloging.model';

export class ModsRecordInfo extends ModsElement {

    descriptionStandard: any;
    recordOrigin: any;
    recordContentSources: ElementField;
    recordCreationDates: ElementField;
    recordChangeDates: ElementField;
    recordIdentifiers: ElementField;
    languageOfCatalogings: ElementField;

    static getSelector() {
        return 'recordInfo';
    }

    static getId() {
        return 'recordInfo';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['descriptionStandard']) {
            this.modsElement['descriptionStandard'] = ModsUtils.createField(this, 'descriptionStandard');
        }
        this.descriptionStandard = this.modsElement['descriptionStandard'][0];
        this.addControl('descriptionStandard');

        if (!this.modsElement['recordOrigin']) {
            this.modsElement['recordOrigin'] = ModsUtils.createField(this,'recordOrigin');
        }
        this.recordOrigin = this.modsElement['recordOrigin'][0];
        this.addControl('recordOrigin');

        if (this.available2('recordContentSource')) {
            this.recordContentSources = new ElementField(this.modsElement, ModsRecordContentSource.getSelector(), this.getField('recordContentSource'));
            this.addSubfield(this.recordContentSources);
            this.addControl('recordContentSource');
        }
        if (this.available2('recordCreationDate')) {
            this.recordCreationDates = new ElementField(this.modsElement, ModsRecordCreationDate.getSelector(), this.getField('recordCreationDate'));
            this.addSubfield(this.recordCreationDates);
            this.addControl('recordCreationDate');
        }
        if (this.available2('recordChangeDate')) {
            this.recordChangeDates = new ElementField(this.modsElement, ModsRecordChangeDate.getSelector(), this.getField('recordChangeDate'));
            this.addSubfield(this.recordChangeDates);
            this.addControl('recordChangeDate');
        }
        if (this.available2('recordIdentifier')) {
            this.recordIdentifiers = new ElementField(this.modsElement, ModsRecordIdentifier.getSelector(), this.getField('recordIdentifier'));
            this.addSubfield(this.recordIdentifiers);
            this.addControl('recordIdentifier');
        }

        if (this.available2('languageOfCataloging')) {
            this.languageOfCatalogings = new ElementField(this.modsElement, ModsLanguageOfCataloging.getSelector(), this.getField('languageOfCataloging'));
            this.addSubfield(this.languageOfCatalogings);
            this.addControl('languageOfCataloging');
        }
    }
}
