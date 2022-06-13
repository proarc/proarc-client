import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsRole extends ModsElement {

    public role: any;

    static getSelector() {
        return 'role';
    }

    static getId() {
        return 'role';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (!this.modsElement['roleTerm']) {
            const attrs = {'type': 'code', 'authority': 'marcrelator'};
            this.modsElement['roleTerm'] = [ModsUtils.createTextElement('', attrs)];
        }
        this.role = this.modsElement['roleTerm'][0];
    }

}
