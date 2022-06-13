import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsLocation extends ModsElement {

    public physicalLocation: any;
    public shelfLocator: any;
    public url: any;

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
        if (!this.modsElement['url']) {
            this.modsElement['url'] = ModsUtils.createEmptyField();
        }
        this.physicalLocation = this.modsElement['physicalLocation'][0];
        this.shelfLocator = this.modsElement['shelfLocator'][0];
        this.url = this.modsElement['url'][0];

    }

}
