import { ModsElement } from './element.model';

export class ModsNote extends ModsElement {

    static getSelector() {
        return 'note';
    }
    constructor(modsElement) {
        super(modsElement, ['type']);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
