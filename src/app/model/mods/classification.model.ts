import { ModsElement } from './element.model';

export class ModsClassification extends ModsElement {

    static getSelector() {
        return 'classification';
    }

    static getId() {
        return 'classification';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority', 'edition']);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
