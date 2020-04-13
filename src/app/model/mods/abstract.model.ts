import { ModsElement } from './element.model';

export class ModsAbstract extends ModsElement {

    static getSelector() {
        return 'abstract';
    }

    static getId() {
        return 'abstract';
    }

    constructor(modsElement) {
        super(modsElement);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
