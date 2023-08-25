import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsFrequency } from './frequency.model';
import {ModsDateIssued} from './dateIssued.model';
import {ModsPlace} from './place.model';
import {ModsDateOther} from './dateOther.model';

export class ModsPublisher extends ModsElement {

    public publisher: any;
    public edition: any;
    public issuance: any;

    public dateCreated: any;
    public copyrightDate: any;

    public frequencies: ElementField;
    public dateIssueds: ElementField;
    public places: ElementField;
    public dateOthers: ElementField;

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
        if (!this.modsElement['publisher']) {
            //this.modsElement['publisher'] = ModsUtils.createEmptyField();
            this.modsElement['publisher'] = ModsUtils.createField(this, 'publisher');
        }
        if (!this.modsElement['edition']) {
            //this.modsElement['edition'] = ModsUtils.createEmptyField();
            this.modsElement['edition'] = ModsUtils.createField(this, 'edition');
        }
        if (!this.modsElement['issuance']) {
            // this.modsElement['issuance'] = ModsUtils.createEmptyField();
            this.modsElement['issuance'] = ModsUtils.createField(this, 'issuance');
        }
        if (!this.modsElement['dateIssued']) {
            this.modsElement['dateIssued'] = [];
        }
        if (!this.modsElement['dateOther']) {
            this.modsElement['dateOther'] = [];
        }
        if (!this.modsElement['copyrightDate']) {
            this.modsElement['copyrightDate'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['dateCreated']) {
            this.modsElement['dateCreated'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['place']) {
            this.modsElement['place'] = [];
        }
        this.publisher = this.modsElement['publisher'][0];
        this.edition = this.modsElement['edition'][0];
        this.issuance = this.modsElement['issuance'][0];
        this.dateCreated = this.modsElement['dateCreated'][0];
        this.copyrightDate = this.modsElement['copyrightDate'][0];

        if(this.available('frequency')) {
            this.frequencies = new ElementField(this.modsElement, ModsFrequency.getSelector(), this.getField('frequency'));
            this.addSubfield(this.frequencies);
        }
        if(this.available("dateIssued")) {
          this.dateIssueds = new ElementField(this.modsElement, ModsDateIssued.getSelector(), this.getField('dateIssued'));
          this.addSubfield(this.dateIssueds);
        }
        if (this.available("place")) {
          this.places = new ElementField(this.modsElement, ModsPlace.getSelector(), this.getField('place'));
          this.addSubfield(this.places);
        }
        if (this.available("dateOther")) {
          this.dateOthers = new ElementField(this.modsElement, ModsDateOther.getSelector(), this.getField('dateOther'));
          this.addSubfield(this.dateOthers);
        }
    }

    public override update() {
    }

}
