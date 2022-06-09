import { ModsElement } from './element.model';

export class ModsAbstract extends ModsElement {

    static getSelector() {
        return 'abstract';
    }

    static getId() {
        return 'abstract';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['lang']);
        this.init();
    }

    private init() {
    }

}
