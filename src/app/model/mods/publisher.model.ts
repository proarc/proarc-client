import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsFrequency } from './frequency.model';

export class ModsPublisher extends ModsElement {

    public publisher;
    public edition;
    public issuance;
    public place;
    public dateIssued;
    public dateFrom;
    public dateTo;

    public dateOther;
    public dateCreated;
    public copyrightDate;

    public frequencies: ElementField;

    static getSelector() {
        return 'originInfo';
    }

    static getId() {
        return 'originInfo';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['eventType', 'transliteration']);
        this.init();
    }

    private init() {
        if (!this.modsElement['publisher']) {
            this.modsElement['publisher'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['edition']) {
            this.modsElement['edition'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['issuance']) {
            this.modsElement['issuance'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['dateIssued']) {
            this.modsElement['dateIssued'] = [];
        }
        if (!this.modsElement['dateOther']) {
            this.modsElement['dateOther'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['copyrightDate']) {
            this.modsElement['copyrightDate'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['dateCreated']) {
            this.modsElement['dateCreated'] = ModsUtils.createEmptyField();
        }
        const dates = this.modsElement['dateIssued'];
        for (let index = dates.length - 1; index >= 0; index--) {
            if (dates[index] == "") {
                dates.splice(index, 1);
            }
        }
        for (let date of dates) {
            if (ModsUtils.hasAttributeWithValue(date, 'point', 'start')) {
                this.dateFrom = date;
            }  else if (ModsUtils.hasAttributeWithValue(date, 'point', 'end')) {
                this.dateTo = date;
            }  else {
                this.dateIssued = date;
            }
        }
        if (this.dateFrom == null) {
            this.dateFrom = ModsUtils.createTextElement('', {'point': 'start'});
            dates.push(this.dateFrom);
        }
        if (this.dateTo == null) {
            this.dateTo = ModsUtils.createTextElement('', {'point': 'end'});
            dates.push(this.dateTo);
        }
        if (this.dateIssued == null) {
            let dateText = '';
            let qualifier = '';
            if (this.dateFrom['_'] && this.dateFrom['_']) {
                dateText = this.dateFrom['_'] + '-' + this.dateTo['_'];
                if (this.dateFrom['$']['qualifier']) {
                    qualifier = this.dateFrom['$']['qualifier'];
                } else if (this.dateTo['$']['qualifier']) {
                    qualifier = this.dateTo['$']['qualifier'];
                }
            }
            this.dateIssued = ModsUtils.createTextElement(dateText, {qualifier: qualifier, encoding: 'w3cdtf'});
            dates.push(this.dateIssued);
        }
        if (!this.dateIssued['$']) {
            this.dateIssued['$'] = {
                qualifier: '',
                encoding: 'w3cdtf'
            };
        }
        if (!this.dateIssued['$']['qualifier']) {
            this.dateIssued['$']['qualifier'] = '';
        }
        if (!this.dateIssued['$']['encoding']) {
            this.dateIssued['$']['encoding'] = 'w3cdtf';
        }
        if (this.dateFrom && !this.dateFrom['$']['encoding']) {
            this.dateFrom['$']['encoding'] = 'w3cdtf';
        }
        if (this.dateTo && !this.dateTo['$']['encoding']) {
            this.dateTo['$']['encoding'] = 'w3cdtf';
        }
        const dindex = dates.indexOf(this.dateIssued);
        if (dindex > 0) {
            dates.splice(dindex, 1);
            dates.unshift(this.dateIssued);
        }
        for (const date of dates) {
            if (ModsUtils.hasAttributeWithValue(date, 'point', 'start')) {
                this.dateFrom = date;
            }  else if (ModsUtils.hasAttributeWithValue(date, 'point', 'end')) {
                this.dateTo = date;
            }  else {
                this.dateIssued = date;
            }
        }



        if (!this.modsElement['place']) {
            this.modsElement['place'] = [];
        }
        this.publisher = this.modsElement['publisher'][0];
        this.edition = this.modsElement['edition'][0];
        this.issuance = this.modsElement['issuance'][0];
        this.dateCreated = this.modsElement['dateCreated'][0];
        this.dateOther = this.modsElement['dateOther'][0];
        this.copyrightDate = this.modsElement['copyrightDate'][0];

        const ctx = this;
        this.modsElement['place'].forEach(function(place) {
            if (place['placeTerm'] &&
                place['placeTerm'][0] &&
                place['placeTerm'][0]['$'] &&
                place['placeTerm'][0]['$']['type'] === 'text') {
                    ctx.place = place['placeTerm'][0];
                }
        });
        if (!this.place) {
            const attrs = {'type': 'text'};
            const place = ModsUtils.createObjWithTextElement('placeTerm', '', attrs);
            this.place = place['placeTerm'][0];
            this.modsElement['place'].push(place);
        }
        if(this.available('frequency')) {
            this.frequencies = new ElementField(this.modsElement, ModsFrequency.getSelector(), this.getField('frequency'));
            this.addSubfield(this.frequencies);
        }
    }

    public update() {
        const dateParts = this.dateIssued['_'].split('-');
        if (dateParts.length === 2 && dateParts[0] && dateParts[1]) {
            this.dateFrom['_'] = dateParts[0];
            this.dateTo['_'] = dateParts[1];
            const qualifier = this.dateIssued['$']['qualifier'];
            this.dateFrom['$']['qualifier'] = qualifier;
            this.dateTo['$']['qualifier'] = qualifier;
            // this.dateIssued['_'] = '';
        } else {
            this.dateFrom['_'] = '';
            this.dateTo['_'] = '';
        }
    }

}
