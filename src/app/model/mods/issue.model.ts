import { ModsElement } from './element.model';

export class ModsIssue extends ModsElement {

    public date;
    public number;

    constructor(modsElement) {
        super(modsElement, null);
        this.init();
    }

    private init() {
        if (!this.modsElement['titleInfo']) {
            this.modsElement['titleInfo'] = [{}];
        }
        if (!this.modsElement['titleInfo'][0]) {
            this.modsElement['titleInfo'][0] = {};
        }
        if (!this.modsElement['titleInfo'][0]['partNumber']) {
            this.modsElement['titleInfo'][0]['partNumber'] = [
                { '_': '' }
            ];
        }
        if (!this.modsElement['titleInfo'][0]['partNumber'][0]) {
            this.modsElement['titleInfo'][0]['partNumber'][0] = { '_': '' };
        }
        if (!this.modsElement['originInfo']) {
            this.modsElement['originInfo'] = [{}];
        }
        if (!this.modsElement['originInfo'][0]['dateIssued']) {
            this.modsElement['originInfo'][0]['dateIssued'] = [
                { '_': '' }
            ];
        }
        if (!this.modsElement['originInfo'][0]['dateIssued'][0]) {
            this.modsElement['originInfo'][0]['dateIssued'][0] = { '_': '' };
        }

        if (!this.modsElement['part']) {
            this.modsElement['part'] = [{}];
        }
        if (!this.modsElement['part'][0]['detail']) {
            this.modsElement['part'][0]['detail'] = [{}];
        }
        if (!this.modsElement['part'][0]['date']) {
            this.modsElement['part'][0]['date'] = [{ '_': '' }];
        }
        if (!this.modsElement['part'][0]['date'][0]) {
            this.modsElement['part'][0]['date'][0] = { '_': '' };
        }
        if (!this.modsElement['part'][0]['detail'][0]['number']) {
            this.modsElement['part'][0]['detail'][0]['number'] = [
                { '_': '' }
            ];
        }
        if (!this.modsElement['part'][0]['detail'][0]['number'][0]) {
            this.modsElement['part'][0]['detail'][0]['number'][0] = { '_': '' };
        }

        this.number = this.modsElement['titleInfo'][0]['partNumber'][0];
        this.date = this.modsElement['originInfo'][0]['dateIssued'][0];

        if (!this.number['_']) {
            this.number = this.modsElement['part'][0]['detail'][0]['number'][0];
            this.modsElement['titleInfo'][0]['partNumber'][0] = this.number;
        } else {
            this.modsElement['part'][0]['detail'][0]['number'][0] = this.number;
        }
        if (!this.date['_']) {
            this.date = this.modsElement['part'][0]['date'][0];
            this.modsElement['originInfo'][0]['dateIssued'][0] = this.date;
        } else {
            this.modsElement['part'][0]['date'][0] = this.date;
        }

    }

}
