import ModsUtils from './utils';
import { ModsElement } from './element.model';

export class ModsGeo extends ModsElement {

    public stat;
    public kraj_1960;
    public region_soudrznosti;
    public okres;
    public vusc;
    public orp;
    public pou;
    public obec;
    public zsj;
    public katastralni_uzemi;
    public cast_obce;
    public ulice;
    public adresni_misto;



    static getSelector() {
        return 'subject';
    }

    constructor(modsElement) {
        super(modsElement, ['authority']);
        this.init();
    }

    private init() {
        if (!this.attrs['authority']) {
            this.attrs['authority'] = 'geo:origin';
        }
        if (!this.modsElement['geographic']) {
            this.modsElement['geographic'] = [];
        }
        const geographics = this.modsElement['geographic'];
        for (const geographic of geographics) {
            if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:STAT')) {
                this.stat = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:KRAJ_1960')) {
                this.kraj_1960 = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:REGION_SOUDRZNOSTI')) {
                this.region_soudrznosti = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:OKRES')) {
                this.okres = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:VUSC')) {
                this.vusc = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:ORP')) {
                this.orp = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:POU')) {
                this.pou = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:OBEC')) {
                this.obec = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:ZSJ')) {
                this.zsj = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:KATASTRALNI_UZEMI')) {
                this.katastralni_uzemi = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:CAST_OBCE')) {
                this.cast_obce = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:ULICE')) {
                this.ulice = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN:ADRESNI_MISTO')) {
                this.adresni_misto = geographic;
            }
        }
        if (this.stat == null) {
            this.stat = ModsUtils.createTextElement('', { 'authority': 'RUIAN:STAT' });
            geographics.push(this.stat);
        }
        if (this.kraj_1960 == null) {
            this.kraj_1960 = ModsUtils.createTextElement('', { 'authority': 'RUIAN:KRAJ_1960' });
            geographics.push(this.kraj_1960);
        }
        if (this.region_soudrznosti == null) {
            this.region_soudrznosti = ModsUtils.createTextElement('', { 'authority': 'RUIAN:REGION_SOUDRZNOSTI' });
            geographics.push(this.region_soudrznosti);
        }
        if (this.okres == null) {
            this.okres = ModsUtils.createTextElement('', { 'authority': 'RUIAN:OKRES' });
            geographics.push(this.okres);
        }
        if (this.vusc == null) {
            this.vusc = ModsUtils.createTextElement('', { 'authority': 'RUIAN:VUSC' });
            geographics.push(this.vusc);
        }
        if (this.orp == null) {
            this.orp = ModsUtils.createTextElement('', { 'authority': 'RUIAN:ORP' });
            geographics.push(this.orp);
        }
        if (this.pou == null) {
            this.pou = ModsUtils.createTextElement('', { 'authority': 'RUIAN:POU' });
            geographics.push(this.pou);
        }
        if (this.obec == null) {
            this.obec = ModsUtils.createTextElement('', { 'authority': 'RUIAN:OBEC' });
            geographics.push(this.obec);
        }
        if (this.zsj == null) {
            this.zsj = ModsUtils.createTextElement('', { 'authority': 'RUIAN:ZSJ' });
            geographics.push(this.zsj);
        }
        if (this.katastralni_uzemi == null) {
            this.katastralni_uzemi = ModsUtils.createTextElement('', { 'authority': 'RUIAN:KATASTRALNI_UZEMI' });
            geographics.push(this.katastralni_uzemi);
        }
        if (this.cast_obce == null) {
            this.cast_obce = ModsUtils.createTextElement('', { 'authority': 'RUIAN:CAST_OBCE' });
            geographics.push(this.cast_obce);
        }
        if (this.ulice == null) {
            this.ulice = ModsUtils.createTextElement('', { 'authority': 'RUIAN:ULICE' });
            geographics.push(this.ulice);
        }
        if (this.adresni_misto == null) {
            this.adresni_misto = ModsUtils.createTextElement('', { 'authority': 'RUIAN:ADRESNI_MISTO' });
            geographics.push(this.adresni_misto);
        }
    }

    public toDC() {
        return '';
    }

}
