import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsLocation extends ModsElement {

    public physicalLocation;
    public shelfLocator;

    static getSelector() {
        return 'location';
    }

    constructor(modsElement) {
        super(modsElement);
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
    }

    public toDC() {
        let dc = '';
        if (this.physicalLocation['_']) {
            dc += ModsUtils.dcEl('source', this.physicalLocation['_']);
        }
        if (this.shelfLocator['_']) {
            dc += ModsUtils.dcEl('source', this.shelfLocator['_']);
        }
        return dc;
    }

}
