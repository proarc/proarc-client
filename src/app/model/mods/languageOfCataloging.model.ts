import { ModsElement } from './element.model';
import ModsUtils from './utils';

export class ModsLanguageOfCataloging extends ModsElement {

    public language: any;

    static getSelector() {
        return 'languageOfCataloging';
    }

    static getId() {
        return 'languageOfCataloging';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, );
        this.init();
    }

    private init() {
      if (!this.modsElement['languageTerm']) {
        const attrs = {'type': 'code', 'authority': 'iso639-2b'};
        this.modsElement['languageTerm'] = [ModsUtils.createTextElement('', attrs)];
      }
      this.language = this.modsElement['languageTerm'][0];
      this.addControl('language');
      this.addControl('languageTerm');
      this.addControl('type');
      this.addControl('authority');

    }


}
