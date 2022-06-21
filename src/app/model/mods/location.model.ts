import { ModsElement } from './element.model';
import ModsUtils from './utils';
import {ElementField} from './elementField.model';
import {ModsUrl} from './url.model';

export class ModsLocation extends ModsElement {

    public physicalLocation: any;
    public shelfLocator: any;

    public urls: ElementField;

    static getSelector() {
        return 'location';
    }

    static getId() {
        return 'location';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['physicalLocation']) {
            const attrs = { 'authority': 'siglaADR' };
            this.modsElement['physicalLocation'] = [ModsUtils.createTextElement('', attrs)];
        }
        if (!this.modsElement['shelfLocator']) {
            this.modsElement['shelfLocator'] = ModsUtils.createEmptyField();
        }
        this.physicalLocation = this.modsElement['physicalLocation'][0];
        this.shelfLocator = this.modsElement['shelfLocator'][0];

      if(this.available("url")) {
        this.urls = new ElementField(this.modsElement, ModsUrl.getSelector(), this.getField('url'));
        this.addSubfield(this.urls);
      }

    }

}
