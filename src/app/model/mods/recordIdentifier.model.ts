import { ModsElement } from './element.model';

export class ModsRecordIdentifier extends ModsElement {

    static getSelector() {
        return 'recordIdentifier';
    }

    static getId() {
        return 'recordIdentifier';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['source']);
        this.init();
    }

    private init() {
    }


}
