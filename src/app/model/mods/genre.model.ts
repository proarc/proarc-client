import { ModsElement } from './element.model';

export class ModsGenre extends ModsElement {

    static getSelector() {
        return 'genre';
    }

    static getId() {
        return 'genre';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['authority', 'type', 'lang']);
        this.init();
    }

    private init() {
        const c = this.getControl('peer-reviewed');
    }

}
