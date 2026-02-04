import { ModsElement } from './element.model';

export class ModsGeneric extends ModsElement {

    genericId: string;

    static getSelector() {
        return 'generic';
    }

    static getId() {
        return 'generic';
    }

    constructor(modsElement: any, template: any, id: string) {
        super(modsElement, template);
        this.genericId = id;
    }

}
