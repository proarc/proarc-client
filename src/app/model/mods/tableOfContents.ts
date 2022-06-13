import { ModsElement } from './element.model';

export class ModsTableOfContents extends ModsElement {

    static getSelector() {
        return 'tableOfContents';
    }

    static getId() {
        return 'tableOfContents';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['displayLabel']);
        this.init();
    }

    private init() {
    }
}
