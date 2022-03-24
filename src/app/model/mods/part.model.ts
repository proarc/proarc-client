import ModsUtils from './utils';
import { ModsElement } from './element.model';

export class ModsPart extends ModsElement {

    // part;
    // type;
    // detail;
    // caption;

    static getSelector() {
        return 'part';
    }

    static getId() {
        return 'part';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
        // if (!this.modsElement['part']) {
        //     this.modsElement['part'] = ModsUtils.createEmptyField();
        // }
        // if (!this.modsElement['type']) {
        //     this.modsElement['type'] = ModsUtils.createEmptyField();
        // }
        // if (!this.modsElement['detail']) {
        //     this.modsElement['detail'] = ModsUtils.createEmptyField();
        // }
        // if (!this.modsElement['caption']) {
        //     this.modsElement['caption'] = ModsUtils.createEmptyField();
        // }
        //
        // this.part = this.modsElement['part'][0];
        // this.type = this.modsElement['type'][0];
        // this.detail = this.modsElement['detail'][0];
        // this.caption = this.modsElement['caption'][0];
    }
}
