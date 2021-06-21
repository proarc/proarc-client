import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsCartographics extends ModsElement {

    coordinates;
    scale;

    static getSelector() {
        return 'cartographics';
    }

    static getId() {
        return 'cartographics';
    }

    constructor(modsElement, template) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['coordinates']) {
            this.modsElement['coordinates'] = [ModsUtils.createTextElement('', null)];
        }
        this.coordinates = this.modsElement['coordinates'][0];

        if (!this.modsElement['scale']) {
            this.modsElement['scale'] = [ModsUtils.createTextElement('', null)];
        }
        this.scale = this.modsElement['scale'][0];
    }

}
