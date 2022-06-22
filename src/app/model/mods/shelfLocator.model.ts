import { ModsElement } from './element.model';

export class ModsShelfLocator extends ModsElement {

    static getSelector() {
        return 'shelfLocator';
    }

    static getId() {
        return 'shelfLocator';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
    }


}
