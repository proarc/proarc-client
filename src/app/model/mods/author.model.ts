import { ElementField } from './elementField.model';
import { ModsRole } from './role.model';
import { ModsElement } from './element.model';
import ModsUtils from './utils';
import {ModsFrequency} from './frequency.model';
import {ModsNamePart} from './namePart.model';

export class ModsAuthor extends ModsElement {

    public affiliation: any;
    public name: { [x: string]: string; };
    public given: { [x: string]: any; };
    public family: { [x: string]: any; };
    public termsOfAddress: any;
    public date: any;
    public roles: ElementField;
    public nameParts: ElementField;
    public nameIdentifier: {[x: string]: string; };
    public nameIdentifierOrcId: {[x: string]: string; };
    public etal: string;

    static getSelector() {
        return 'name';
    }

    static getId() {
        return 'name';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'usage']);
        this.init();
    }


    private init() {
        if (!this.modsElement['affiliation']) {
            this.modsElement['affiliation'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['namePart']) {
            this.modsElement['namePart'] = [];
        }
        this.affiliation = this.modsElement['affiliation'][0];
        // const nameParts = this.modsElement['namePart'];
        // for (const namePart of nameParts) {
        //     if (!ModsUtils.hasAnyAttribute(namePart)) {
        //         this.name = namePart;
        //     }  else if (ModsUtils.hasAttributeWithValue(namePart, 'type', 'date')) {
        //         this.date = namePart;
        //     }  else if (ModsUtils.hasAttributeWithValue(namePart, 'type', 'family')) {
        //         this.family = namePart;
        //     }  else if (ModsUtils.hasAttributeWithValue(namePart, 'type', 'given')) {
        //         this.given = namePart;
        //     } else if (ModsUtils.hasAttributeWithValue(namePart, 'type', 'termsOfAddress')) {
        //         this.termsOfAddress = namePart;
        //     }
        // }
        // if (this.name == null) {
        //     this.name = ModsUtils.createTextElement('', null);
        //     nameParts.push(this.name);
        // }
        // if (this.date == null) {
        //     this.date = ModsUtils.createTextElement('', {'type': 'date'});
        //     nameParts.push(this.date);
        // }
        // if (this.family == null) {
        //     this.family = ModsUtils.createTextElement('', {'type': 'family'});
        //     nameParts.push(this.family);
        // }
        // if (this.given == null) {
        //     this.given = ModsUtils.createTextElement('', {'type': 'given'});
        //     nameParts.push(this.given);
        // }
        // if (this.termsOfAddress == null) {
        //     this.termsOfAddress = ModsUtils.createTextElement('', {'type': 'termsOfAddress'});
        //     nameParts.push(this.termsOfAddress);
        // }
        if (this.available('role')) {
            this.roles = new ElementField(this.modsElement, ModsRole.getSelector(), this.getField('role'));
            this.addSubfield(this.roles);
        }

        if(this.available('namePart')) {
            this.nameParts = new ElementField(this.modsElement, ModsNamePart.getSelector(), this.getField('namePart'));
            this.addSubfield(this.nameParts);
        }


        if (!this.modsElement['nameIdentifier']) {
            this.modsElement['nameIdentifier'] = [];
        }
        const nameIdentifiers = this.modsElement['nameIdentifier'];
        for (const nameIdentifier of nameIdentifiers) {
            if (!ModsUtils.hasAnyAttribute(nameIdentifier)) {
                this.nameIdentifier = nameIdentifier;
            }  else if (ModsUtils.hasAttributeWithValue(nameIdentifier, 'type', 'orcid')) {
                this.nameIdentifierOrcId = nameIdentifier;
            }
        }

        if (this.nameIdentifier == null) {
          this.nameIdentifier = ModsUtils.createTextElement('', null);
          nameIdentifiers.push(this.nameIdentifier);
        }
        if (this.nameIdentifierOrcId == null) {
          this.nameIdentifierOrcId = ModsUtils.createTextElement('', {'type': 'orcid'});
          nameIdentifiers.push(this.nameIdentifierOrcId);
        }

        if (!this.modsElement['etal']) {
            this.modsElement['etal'] = ModsUtils.createEmptyField();
        }
        this.etal = this.modsElement['etal'][0];


        // if (this.modsElement['nameIdentifier']) {
        //     this.nameIdentifier = this.modsElement['nameIdentifier'][0]['_'];
        // }

        // this.splitName();
    }


    // public splitName() {
    //     const nameParts = this.name['_'].split(',');
    //     if (nameParts.length === 2) {
    //         this.family['_'] = nameParts[0].trim();
    //         this.given['_'] = nameParts[1].trim();
    //         this.name['_'] = '';
    //     }
    // }

    // public canSplitName(): boolean {
    //     const nameParts = this.name['_'].split(',');
    //     return nameParts.length === 2;
    // }

    public isPrimary(): boolean {
        return this.attrs['usage'] === 'primary';
    }

    public switchPrimary() {
        if (this.isPrimary()) {
            this.attrs['usage'] = '';
        } else {
            this.attrs['usage'] = 'primary';
        }
    }

}
