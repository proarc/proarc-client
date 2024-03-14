import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsFrequency } from './frequency.model';
import {ModsDateIssued} from './dateIssued.model';
import {ModsPlace} from './place.model';
import {ModsDateOther} from './dateOther.model';
import {ModsDateCreated} from './dateCreated.model';
import {ModsDateValid} from './dateValid.model';
import {ModsDateCaptured} from './dateCaptured.model';
import {ModsDateModified} from './dateModified.model';
import {ModsEdition} from './edition.model';

export class ModsPublisher extends ModsElement {

    public publisher: any;
    public issuance: any;

    public copyrightDate: any;

    public frequencies: ElementField;
    public dateIssueds: ElementField;
    public dateCreateds: ElementField;
    public places: ElementField;
    public dateOthers: ElementField;
    public dateValids: ElementField;
    public dateCaptureds: ElementField;
    public dateModifieds: ElementField;
    public editions: ElementField;

    static getSelector() {
        return 'originInfo';
    }

    static getId() {
        return 'originInfo';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['eventType', 'transliteration']);
        this.init();
    }

    private init() {
      this.addControl('eventType');
      this.addControl('transliteration');

        if (!this.modsElement['publisher']) {
            //this.modsElement['publisher'] = ModsUtils.createEmptyField();
            this.modsElement['publisher'] = ModsUtils.createField(this, 'publisher');
        }
        this.publisher = this.modsElement['publisher'][0];
        this.addControl('publisher');


        if (!this.modsElement['issuance']) {
            // this.modsElement['issuance'] = ModsUtils.createEmptyField();
            this.modsElement['issuance'] = ModsUtils.createField(this, 'issuance');
        }
        this.issuance = this.modsElement['issuance'][0];
        this.addControl('issuance');

        if (!this.modsElement['dateIssued']) {
            this.modsElement['dateIssued'] = [];
        }
        if(this.available2('dateIssued')) {
          this.dateIssueds = new ElementField(this.modsElement, ModsDateIssued.getSelector(), this.getField('dateIssued'));
          this.addSubfield(this.dateIssueds);
        }
        this.addControl('dateIssueds');

        if (!this.modsElement['dateOther']) {
            this.modsElement['dateOther'] = [];
        }
        if (this.available2('dateOther')) {
          this.dateOthers = new ElementField(this.modsElement, ModsDateOther.getSelector(), this.getField('dateOther'));
          this.addSubfield(this.dateOthers);
        }
        this.addControl('dateOthers');

        if (!this.modsElement['copyrightDate']) {
            this.modsElement['copyrightDate'] = ModsUtils.createField(this, 'copyrightDate');;
        }
        this.copyrightDate = this.modsElement['copyrightDate'][0];
        this.addControl('copyrightDate');

        if (!this.modsElement['dateCreated']) {
            this.modsElement['dateCreated'] = [];
        }
        if (this.available2('dateCreated')) {
          this.dateCreateds = new ElementField(this.modsElement, ModsDateCreated.getSelector(), this.getField('dateCreated'));
          this.addSubfield(this.dateCreateds);
        }
        this.addControl('dateCreateds');

        if (!this.modsElement['dateValid']) {
            this.modsElement['dateValid'] = [];
        }
        if (this.available2('dateValid')) {
          this.dateValids = new ElementField(this.modsElement, ModsDateValid.getSelector(), this.getField('dateValid'));
          this.addSubfield(this.dateValids);
        }
        this.addControl('dateValids');

        if (!this.modsElement['dateCaptured']) {
            this.modsElement['dateCaptured'] = [];
        }
        if (this.available2('dateCaptured')) {
          this.dateCaptureds = new ElementField(this.modsElement, ModsDateCaptured.getSelector(), this.getField('dateCaptured'));
          this.addSubfield(this.dateCaptureds);
        }
        this.addControl('dateCaptured');

        if (!this.modsElement['dateModified']) {
            this.modsElement['dateModified'] = [];
        }
        if (this.available2('dateModified')) {
          this.dateModifieds = new ElementField(this.modsElement, ModsDateModified.getSelector(), this.getField('dateModified'));
          this.addSubfield(this.dateModifieds);
        }
        this.addControl('dateModified');

        if (!this.modsElement['place']) {
            this.modsElement['place'] = [];
        }
        if (this.available2('place')) {
          this.places = new ElementField(this.modsElement, ModsPlace.getSelector(), this.getField('place'));
          this.addSubfield(this.places);
        }
        this.addControl('place');

        if(this.available2('frequency')) {
            this.frequencies = new ElementField(this.modsElement, ModsFrequency.getSelector(), this.getField('frequency'));
            this.addSubfield(this.frequencies);
            this.addControl('frequency');
        }

        if (this.available2('edition')) {
          this.editions = new ElementField(this.modsElement, ModsEdition.getSelector(), this.getField('edition'));
          this.addSubfield(this.editions);
          this.addControl('edition');
        }

    }

    public override update() {
    }

}
