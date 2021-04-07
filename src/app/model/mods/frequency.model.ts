import { ModsElement } from './element.model';

export class ModsFrequency extends ModsElement {

    static getSelector() {
        return 'frequency';
    }

    static getId() {
        return 'frequency';
    }

    constructor(modsElement) {
        super(modsElement, ['authority']);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
