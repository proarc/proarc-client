import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsIdentifier extends ModsElement {

    static getSelector() {
        return 'identifier';
    }

    static getId() {
        return 'identifier';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['type', 'invalid']);
        this.init();
    }

    private init() {
    }

}
