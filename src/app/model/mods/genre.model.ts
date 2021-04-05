import { ModsElement } from './element.model';

export class ModsGenre extends ModsElement {

    static getSelector() {
        return 'genre';
    }

    static getId() {
        return 'genre';
    }

    constructor(modsElement) {
        super(modsElement, ['authority']);
        this.init();
    }

    private init() {
    }

    public toDC() {
        return '';
    }

}
