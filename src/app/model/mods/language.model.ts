import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsLanguage extends ModsElement {

    public language;

    static getSelector() {
        return 'language';
    }

    constructor(modsElement) {
        super(modsElement);
        this.init();
    }

    private init() {
        if (!this.modsElement['languageTerm']) {
            const attrs = {'type': 'code', 'authority': 'iso639-2b'};
            this.modsElement['languageTerm'] = [ModsUtils.createTextElement('', attrs)];
        }
        this.language = this.modsElement['languageTerm'][0];
    }

    public toDC() {
        if (this.language['_']) {
            return ModsUtils.dcEl('language', this.language['_']);
        } else {
            return '';
        }
    }

}
