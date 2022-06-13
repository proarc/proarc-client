import { ModsElement } from './element.model';

export class ModsNote extends ModsElement {

    static getSelector() {
        return 'note';
    }

    static getId() {
        return 'note';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
    }

}
