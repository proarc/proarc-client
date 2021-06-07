import { ModsElement } from './element.model';

export class ModsFrequency extends ModsElement {

    static getSelector() {
        return 'frequency';
    }

    static getId() {
        return 'frequency';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
    }


}
