import { ModsElement } from './element.model';

export class ModsRecordContentSource extends ModsElement {

    static getSelector() {
        return 'recordContectSource';
    }

    static getId() {
        return 'recordContectSource';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
    }


}
