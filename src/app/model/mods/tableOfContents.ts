import { ModsElement } from './element.model';

export class ModsTableOfContents extends ModsElement {

    static getSelector() {
        return 'tableOfContents';
    }

    static getId() {
        return 'tableOfContents';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['displayLabel']);
        this.init();
    }

    private init() {
    }
}
