import { ModsElement } from './element.model';

export class ModsResource extends ModsElement {

    public language;

    static getSelector() {
        return 'typeOfResource';
    }

    static getId() {
        return 'typeOfResource';
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
