import { ModsElement } from './element.model';

export class ModsRecordContentSource extends ModsElement {

    static getSelector() {
        return 'recordContentSource';
    }

    static getId() {
        return 'recordContentSource';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
    }


}
