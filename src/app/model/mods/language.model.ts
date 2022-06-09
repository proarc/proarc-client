import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsLanguage extends ModsElement {

    public language: any;

    static getSelector() {
        return 'language';
    }

    static getId() {
        return 'language';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['objectPart']);
        this.init();
    }

    private init() {
        if (!this.modsElement['languageTerm']) {
            const attrs = {'type': 'code', 'authority': 'iso639-2b'};
            this.modsElement['languageTerm'] = [ModsUtils.createTextElement('', attrs)];
        }
        this.language = this.modsElement['languageTerm'][0];
    }
    
}
