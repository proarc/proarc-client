import ModsUtils from './utils';
import { ModsElement } from './element.model';

export class ModsPhysical extends ModsElement {

    note;
    extent;

    static getSelector() {
        return 'physicalDescription';
    }

    static getId() {
        return 'physicalDescription';
    }

    constructor(modsElement) {
        super(modsElement);
        this.init();
    }

    private init() {
        if (!this.modsElement['extent']) {
            this.modsElement['extent'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['note']) {
            this.modsElement['note'] = ModsUtils.createEmptyField();
        }
        this.extent = this.modsElement['extent'][0];
        this.note = this.modsElement['note'][0];
    }

    toDC() {
        return '';
    }

}
