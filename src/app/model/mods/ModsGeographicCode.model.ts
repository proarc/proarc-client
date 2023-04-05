import { ModsElement } from './element.model';

export class ModsGeographicCode extends ModsElement {


    static getSelector() {
        return 'geographicCode';
    }

    static getId() {
        return 'geographicCode';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
    }

}
