import { ModsElement } from './element.model';

export class ModsUrl extends ModsElement {

    static getSelector() {
        return 'url';
    }

    static getId() {
        return 'url';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['usage', 'note']);
        this.init();
    }

    private init() {
    }


}
