import { ModsElement } from './element.model';

export class ModsRecordCreationDate extends ModsElement {

    static getSelector() {
        return 'recordCreationDate';
    }

    static getId() {
        return 'recordCreationDate';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['encoding']);
        this.init();
    }

    private init() {
    }


}
