import { ModsElement } from './element.model';

export class ModsResource extends ModsElement {

    public language;

    static getSelector() {
        return 'typeOfResource';
    }

    static getId() {
        return 'typeOfResource';
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
