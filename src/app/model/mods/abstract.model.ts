import { ModsElement } from './element.model';

export class ModsAbstract extends ModsElement {

    static getSelector() {
        return 'abstract';
    }

    static getId() {
        return 'abstract';
    }

    constructor(modsElement, template) {
        super(modsElement, template);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
