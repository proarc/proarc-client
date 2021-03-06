import { ModsElement } from './element.model';

export class ModsGenre extends ModsElement {

    static getSelector() {
        return 'genre';
    }

    static getId() {
        return 'genre';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority', 'type']);
        this.init();
    }

    private init() {
    }

}
