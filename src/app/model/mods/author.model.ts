import { ElementField } from './elementField.model';
import { ModsRole } from './role.model';
import { ModsElement } from './element.model';
import ModsUtils from './utils';
import {ModsFrequency} from './frequency.model';
import {ModsNamePart} from './namePart.model';
import {ModsDisplayForm} from './displayForm.model';
import {ModsDescription} from './description.model';

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
    public displayForms: ElementField;
    public descriptions: ElementField;

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
        this.addControl('type');
        this.addControl('usage');

        if (!this.modsElement['affiliation']) {
            this.modsElement['affiliation'] = ModsUtils.createField(this, 'affiliation');
        }
        this.affiliation = this.modsElement['affiliation'][0];
        this.addControl('affiliation');
        if(this.available2('namePart')) {
        
        if (!this.modsElement['namePart']) {
            this.modsElement['namePart'] = [];
        }
            this.nameParts = new ElementField(this.modsElement, ModsNamePart.getSelector(), this.getField('namePart'));
            this.addSubfield(this.nameParts);
        this.addControl('namePart');
        }

        if (this.available2('role')) {
            this.roles = new ElementField(this.modsElement, ModsRole.getSelector(), this.getField('role'));
            this.addSubfield(this.roles);
        this.addControl('role');
        }

        if (this.available2('displayForm')) {
          this.displayForms = new ElementField(this.modsElement, ModsDisplayForm.getSelector(), this.getField('displayForm'));
          this.addSubfield(this.displayForms);
        this.addControl('displayForm');
        }

        if (this.available2('description')) {
          this.descriptions = new ElementField(this.modsElement, ModsDescription.getSelector(), this.getField('description'));
          this.addSubfield(this.descriptions);
          this.addControl('description');
        }


        if (!this.modsElement['nameIdentifier']) {
            this.modsElement['nameIdentifier'] = [];
        }
        this.addControl('nameIdentifier');

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
        this.addControl('nameIdentifierOrcId');

        if (!this.modsElement['etal']) {
            this.modsElement['etal'] = ModsUtils.createField(this, 'etal');
        }
        this.etal = this.modsElement['etal'][0];
        this.addControl('etal');

        

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
