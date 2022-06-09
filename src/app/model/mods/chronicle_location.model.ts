import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsChronicleLocation extends ModsElement {

    public physicalLocation: any;

    static getSelector() {
        return 'location';
    }

    static getId() {
        return 'location_chronicle';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['physicalLocation']) {
            const attrs = { 'displayLabel': '', 'type': ''};
            this.modsElement['physicalLocation'] = [ModsUtils.createTextElement('', attrs)];
        }
        this.physicalLocation = this.modsElement['physicalLocation'][0];
        if (!this.physicalLocation['$']) {
            this.physicalLocation['$'] = { 'type': ''};
        }
        if (!this.physicalLocation['$']['type']) {
            this.physicalLocation['$']['type'] = '';
        }
    }

}
