import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsIdentifier extends ModsElement {

    static getSelector() {
        return 'identifier';
    }

    static getId() {
        return 'identifier';
    }

    constructor(modsElement) {
        super(modsElement, ['type', 'invalid']);
        this.init();
    }

    private init() {
    }

    public toDC() {
        if (this.modsElement['_'] && this.attrs['type']) {
            return ModsUtils.dcEl('identifier', this.attrs['type'] + ':' + this.modsElement['_']);
        } else {
            return '';
        }
    }

}
