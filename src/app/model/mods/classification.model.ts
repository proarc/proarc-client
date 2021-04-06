import { ModsElement } from './element.model';

export class ModsClassification extends ModsElement {

    static getSelector() {
        return 'classification';
    }

    static getId() {
        return 'classification';
    }

    constructor(modsElement) {
        super(modsElement, ['authority', 'edition']);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
