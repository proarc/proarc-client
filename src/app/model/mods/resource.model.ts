import { ModsElement } from './element.model';

export class ModsResource extends ModsElement {

    static getSelector() {
        return 'typeOfResource';
    }

    static getId() {
        return 'typeOfResource';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['manuscript']);
        this.init();
    }

    private init() {
    }
}
