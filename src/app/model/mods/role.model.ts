import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsRole extends ModsElement {

    public role;

    static getSelector() {
        return 'role';
    }

    constructor(modsElement) {
        super(modsElement);
        this.init();
    }

    private init() {
        if (!this.modsElement['roleTerm']) {
            const attrs = {'type': 'code', 'authority': 'marcrelator'};
            this.modsElement['roleTerm'] = [ModsUtils.createTextElement('', attrs)];
        }
        this.role = this.modsElement['roleTerm'][0];
    }

    public toDC() {
        return '';
    }

}
