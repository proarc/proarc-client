import { ModsElement } from './element.model';

export class ModsForm extends ModsElement {

    static getSelector() {
        return 'form';
    }

    static getId() {
        return 'form';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority', 'type']);
        this.init();
    }

    private init() {
    }


}
