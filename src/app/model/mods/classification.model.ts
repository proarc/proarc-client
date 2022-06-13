import { ModsElement } from './element.model';

export class ModsClassification extends ModsElement {

    static getSelector() {
        return 'classification';
    }

    static getId() {
        return 'classification';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority', 'edition']);
        this.init();
    }

    private init() {
    }


}
