import { ModsElement } from './element.model';

export class ModsFrequency extends ModsElement {

    static getSelector() {
        return 'frequency';
    }

    static getId() {
        return 'frequency';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
    }


}
