import { ModsElement } from './element.model';

export class ModsGenreChronical extends ModsElement {

    static getSelector() {
        return 'genre';
    }

    static getId() {
        return 'genre_chronical';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'lang']);
        this.init();
    }

    private init() {
    }
}
