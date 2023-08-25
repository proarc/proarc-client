import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsCartographics extends ModsElement {

    scale: string;
    coordinates: any;


    static getSelector() {
        return 'cartographics';
    }

    static getId() {
        return 'cartographics';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['scale']) {
            this.modsElement['scale'] = ModsUtils.createField(this, 'scale');
        }
        this.scale = this.modsElement['scale'][0];
        if (!this.modsElement['coordinates']) {
            this.modsElement['coordinates'] = [ModsUtils.createTextElement('', null)];
        }
        this.coordinates = this.modsElement['coordinates'][0];


    }

}
