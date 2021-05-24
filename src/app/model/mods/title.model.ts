import ModsUtils from './utils';
import { ModsElement } from './element.model';

export class ModsTitle extends ModsElement {

    nonSort;
    title;
    subTitle;
    partNumber;
    partName;

    static getSelector() {
        return 'titleInfo';
    }

    static getId() {
        return 'titleInfo';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['type']);
        this.init();
    }

    private init() {
        if (!this.modsElement['nonSort']) {
            this.modsElement['nonSort'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['title']) {
            this.modsElement['title'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['subTitle']) {
            this.modsElement['subTitle'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['partNumber']) {
            this.modsElement['partNumber'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['partName']) {
            this.modsElement['partName'] = ModsUtils.createEmptyField();
        }
        this.nonSort = this.modsElement['nonSort'][0];
        this.title = this.modsElement['title'][0];
        this.subTitle = this.modsElement['subTitle'][0];
        this.partNumber = this.modsElement['partNumber'][0];
        this.partName = this.modsElement['partName'][0];
    }

    nonSortToggleDisabled(): boolean {
        return !this.nonSort['_'] && !this.title['_'];
    }

    onNonSotToggleChanged(event) {
        if (event.checked) {
            const str = this.title['_'];
            const wordArray = str.split(' ');
            this.nonSort['_'] = wordArray[0];
            wordArray.splice(0, 1);
            this.title['_'] = wordArray.join(' ').trim();
        } else {
            this.title['_'] = this.nonSort['_'] + ' ' + this.title['_'];
            this.nonSort['_'] = '';
        }
    }

    getFullTitle() {
        let text = '';
        if (this.nonSort['_']) {
            text += this.nonSort['_'];
        }
        if (this.title['_']) {
            if (text !== '') {
                text += ' ';
            }
            text += this.title['_'];
        }
        if (this.subTitle['_']) {
            if (text !== '') {
              text += ': ';
            }
            text += this.subTitle['_'];
        }
        if (this.partNumber['_']) {
            if (text !== '') {
              text += ': ';
            }
            text += this.partNumber['_'];
        }
        if (this.partName['_']) {
            if (text !== '') {
              text += ': ';
            }
            text += this.partName['_'];
        }
        return text;
    }

    toDC() {
        const fullTitle = this.getFullTitle();
        if (fullTitle === '') {
            return '';
        }
        return ModsUtils.dcEl('title', fullTitle);
    }

}
