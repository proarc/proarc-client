import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { FormControl } from '@angular/forms';

export class ModsTitle extends ModsElement {

    nonSort: any;
    title: any;
    subTitle: any;
    partNumber: any;
    partName: any;
    isNonSortToggleDisabled: boolean;
    titleControls: {[key: string]: FormControl} = {};

    static getSelector() {
        return 'titleInfo';
    }

    static getId() {
        return 'titleInfo';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['type', 'lang', 'otherType']);
        this.init();
    }

    private init() {
        this.addControl('type');
        this.addControl('otherType');
        this.addControl('lang');

        if (!this.modsElement['nonSort']) {
            this.modsElement['nonSort'] = ModsUtils.createField(this, 'nonSort');
        }
        if (!this.modsElement['title']) {
            this.modsElement['title'] = ModsUtils.createField(this, 'title');
        }
        if (!this.modsElement['subTitle']) {
            this.modsElement['subTitle'] = ModsUtils.createField(this, 'subTitle');
        }
        if (!this.modsElement['partNumber']) {
            this.modsElement['partNumber'] = ModsUtils.createField(this, 'partNumber');
        }
        if (!this.modsElement['partName']) {
            this.modsElement['partName'] = ModsUtils.createField(this, 'partName');
        }
        this.nonSort = this.modsElement['nonSort'][0];
        this.title = this.modsElement['title'][0];
        this.subTitle = this.modsElement['subTitle'][0];
        this.partNumber = this.modsElement['partNumber'][0];
        this.partName = this.modsElement['partName'][0];
        this.isNonSortToggleDisabled = this.nonSortToggleDisabled();
        this.addControl('title');
        this.addControl('subTitle');
        this.addControl('partNumber');
        this.addControl('partName');
        this.addControl('nonSort');
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
        this.controls['title'].setValue(this.title['_']);
        this.controls['nonSort'].markAsDirty();
    }

}
