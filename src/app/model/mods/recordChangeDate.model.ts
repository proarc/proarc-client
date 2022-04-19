import { ModsElement } from './element.model';

export class ModsRecordChangeDate extends ModsElement {

    static getSelector() {
        return 'recordChangeDate';
    }

    static getId() {
        return 'recordChangeDate';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['encoding']);
        this.init();
    }

    private init() {
    }


}
