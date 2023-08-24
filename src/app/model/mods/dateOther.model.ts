import { ModsElement } from './element.model';

export class ModsDateOther extends ModsElement {

    static getSelector() {
        return 'dateOther';
    }

    static getId() {
        return 'dateOther';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
    }


}
