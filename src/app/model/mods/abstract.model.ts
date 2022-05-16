import { ModsElement } from './element.model';

export class ModsAbstract extends ModsElement {

   public lang;

    static getSelector() {
        return 'abstract';
    }

    static getId() {
        return 'abstract';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['lang']);
        this.init();
    }

    private init() {
    }

}
