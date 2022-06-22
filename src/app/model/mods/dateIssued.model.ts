import { ModsElement } from './element.model';

export class ModsDateIssued extends ModsElement {

    static getSelector() {
        return 'dateIssued';
    }

    static getId() {
        return 'dateIssued';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['qualifier', 'encoding', 'point']);
        this.init();
    }

    private init() {
    }


}
