import ModsUtils from './utils';
import { ModsElement } from './element.model';

export class ModsTitle extends ModsElement {

    nonSort: any;
    title: any;
    subTitle: any;
    partNumber: any;
    partName: any;
    isNonSortToggleDisabled: boolean;

    static getSelector() {
        return 'titleInfo';
    }

    static getId() {
        return 'titleInfo';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'lang']);
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
        this.isNonSortToggleDisabled = this.nonSortToggleDisabled();
    }

    nonSortToggleDisabled(): boolean {
        return !this.nonSort['_'] && !this.title['_'];
    }

    onNonSotToggleChanged(event: any) {
        if (event.checked) {
            const str = this.title['_'] as String;
            const si = str.indexOf(' ');
            const ai = str.indexOf("'");
            let i = -1;
            let ch = '';
            if (si > -1 && (ai == -1 || si < ai)) {
                i = si;
                ch = ' ';
            } else if (ai > -1 && (si == -1 || ai < si)) {
                i = ai;
                ch = "'";
            }
            console.log('i', i);
            if (i > -1) {
                this.nonSort['_'] = str.substr(0, i + 1);
                this.title['_'] = str.substr(i + 1);
            }
            // const wordArray = str.split(' ');
            // this.nonSort['_'] = wordArray[0];
            // wordArray.splice(0, 1);
            // this.title['_'] = wordArray.join(' ').trim();
        } else {
            this.title['_'] = this.nonSort['_'] + this.title['_'];
            this.nonSort['_'] = '';
        }
        
        console.log(this.controls)
        this.getControl('nonSort').markAsDirty();
    }

}
