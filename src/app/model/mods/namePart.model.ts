import { ModsElement } from './element.model';

export class ModsNamePart extends ModsElement {

    public namePart: any;

    static getSelector() {
        return 'namePart';
    }

    static getId() {
        return 'namePart';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
    }

}
