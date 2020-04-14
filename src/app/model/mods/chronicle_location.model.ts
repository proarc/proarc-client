import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsChronicleLocation extends ModsElement {

    public physicalLocation;

    static getSelector() {
        return 'location';
    }

    static getId() {
        return 'location_chronicle';
    }

    constructor(modsElement) {
        super(modsElement);
        this.init();
    }

    private init() {
        if (!this.modsElement['physicalLocation']) {
            const attrs = { 'type': ''};
            this.modsElement['physicalLocation'] = [ModsUtils.createTextElement('', attrs)];
        }
        this.physicalLocation = this.modsElement['physicalLocation'][0];
        if (!this.physicalLocation['$']['type']) {
            this.physicalLocation['$']['type'] = '';
        }
    }

    public toDC() {
        let dc = '';
        if (this.physicalLocation['_']) {
            dc += ModsUtils.dcEl('source', this.physicalLocation['_']);
        }
        return dc;
    }

}
