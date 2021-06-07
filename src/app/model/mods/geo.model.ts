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

    public stat_code;
    public kraj_1960_code;
    public region_soudrznosti_code;
    public okres_code;
    public vusc_code;
    public orp_code;
    public pou_code;
    public obec_code;
    public zsj_code;
    public katastralni_uzemi_code;
    public cast_obce_code;
    public ulice_code;
    public adresni_misto_code;


    public coordinates;

    static getSelector() {
        return 'subject';
    }

    static getId() {
        return 'subject_geo';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority']);
        this.init();
    }

    private init() {
        if (!this.attrs['authority']) {
            // this.attrs['authority'] = 'geo:origin';
        }
        if (!this.modsElement['geographic']) {
            this.modsElement['geographic'] = [];
        }
        if (!this.modsElement['cartographics']) {
            this.modsElement['cartographics'] = ModsUtils.createEmptyField()
        }

        if (!this.modsElement['cartographics']) {
            this.modsElement['cartographics'] = [];
        }
        const ctx = this;
        this.modsElement['cartographics'].forEach(function(cartographics) {
            if (cartographics['coordinates'] &&
                cartographics['coordinates'][0]) {
                    ctx.coordinates = cartographics['coordinates'][0];
                }
        });
        if (!this.coordinates) {
            const coor = ModsUtils.createObjWithTextElement('coordinates', '', null);
            this.coordinates = coor['coordinates'][0];
            this.modsElement['cartographics'].push(coor);
        }
        const geographics = this.modsElement['geographic'];
        for (const geographic of geographics) {
            if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:STAT')) {
                this.stat = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:KRAJ_1960')) {
                this.kraj_1960 = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:REGION_SOUDRZNOSTI')) {
                this.region_soudrznosti = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:OKRES')) {
                this.okres = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:VUSC')) {
                this.vusc = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:ORP')) {
                this.orp = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:POU')) {
                this.pou = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:OBEC')) {
                this.obec = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:ZSJ')) {
                this.zsj = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:KATASTRALNI_UZEMI')) {
                this.katastralni_uzemi = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:CAST_OBCE')) {
                this.cast_obce = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:ULICE')) {
                this.ulice = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_NAME:ADRESNI_MISTO')) {
                this.adresni_misto = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:STAT')) {
                this.stat_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:KRAJ_1960')) {
                this.kraj_1960_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:REGION_SOUDRZNOSTI')) {
                this.region_soudrznosti_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:OKRES')) {
                this.okres_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:VUSC')) {
                this.vusc_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:ORP')) {
                this.orp_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:POU')) {
                this.pou_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:OBEC')) {
                this.obec_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:ZSJ')) {
                this.zsj_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:KATASTRALNI_UZEMI')) {
                this.katastralni_uzemi_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:CAST_OBCE')) {
                this.cast_obce_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:ULICE')) {
                this.ulice_code = geographic;
            }  else if (ModsUtils.hasAttributeWithValue(geographic, 'authority', 'RUIAN_CODE:ADRESNI_MISTO')) {
                this.adresni_misto_code = geographic;
            }
        }
        if (this.stat == null) {
            this.stat = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:STAT' });
            geographics.push(this.stat);
        }
        if (this.kraj_1960 == null) {
            this.kraj_1960 = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:KRAJ_1960' });
            geographics.push(this.kraj_1960);
        }
        if (this.region_soudrznosti == null) {
            this.region_soudrznosti = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:REGION_SOUDRZNOSTI' });
            geographics.push(this.region_soudrznosti);
        }
        if (this.okres == null) {
            this.okres = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:OKRES' });
            geographics.push(this.okres);
        }
        if (this.vusc == null) {
            this.vusc = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:VUSC' });
            geographics.push(this.vusc);
        }
        if (this.orp == null) {
            this.orp = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:ORP' });
            geographics.push(this.orp);
        }
        if (this.pou == null) {
            this.pou = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:POU' });
            geographics.push(this.pou);
        }
        if (this.obec == null) {
            this.obec = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:OBEC' });
            geographics.push(this.obec);
        }
        if (this.zsj == null) {
            this.zsj = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:ZSJ' });
            geographics.push(this.zsj);
        }
        if (this.katastralni_uzemi == null) {
            this.katastralni_uzemi = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:KATASTRALNI_UZEMI' });
            geographics.push(this.katastralni_uzemi);
        }
        if (this.cast_obce == null) {
            this.cast_obce = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:CAST_OBCE' });
            geographics.push(this.cast_obce);
        }
        if (this.ulice == null) {
            this.ulice = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:ULICE' });
            geographics.push(this.ulice);
        }
        if (this.adresni_misto == null) {
            this.adresni_misto = ModsUtils.createTextElement('', { 'authority': 'RUIAN_NAME:ADRESNI_MISTO' });
            geographics.push(this.adresni_misto);
        }

        if (this.stat_code == null) {
            this.stat_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:STAT' });
            geographics.push(this.stat_code);
        }
        if (this.kraj_1960_code == null) {
            this.kraj_1960_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:KRAJ_1960' });
            geographics.push(this.kraj_1960_code);
        }
        if (this.region_soudrznosti_code == null) {
            this.region_soudrznosti_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:REGION_SOUDRZNOSTI' });
            geographics.push(this.region_soudrznosti_code);
        }
        if (this.okres_code == null) {
            this.okres_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:OKRES' });
            geographics.push(this.okres_code);
        }
        if (this.vusc_code == null) {
            this.vusc_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:VUSC' });
            geographics.push(this.vusc_code);
        }
        if (this.orp_code == null) {
            this.orp_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:ORP' });
            geographics.push(this.orp_code);
        }
        if (this.pou_code == null) {
            this.pou_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:POU' });
            geographics.push(this.pou_code);
        }
        if (this.obec_code == null) {
            this.obec_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:OBEC' });
            geographics.push(this.obec_code);
        }
        if (this.zsj_code == null) {
            this.zsj_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:ZSJ' });
            geographics.push(this.zsj_code);
        }
        if (this.katastralni_uzemi_code == null) {
            this.katastralni_uzemi_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:KATASTRALNI_UZEMI' });
            geographics.push(this.katastralni_uzemi_code);
        }
        if (this.cast_obce_code == null) {
            this.cast_obce_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:CAST_OBCE' });
            geographics.push(this.cast_obce_code);
        }
        if (this.ulice_code == null) {
            this.ulice_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:ULICE' });
            geographics.push(this.ulice_code);
        }
        if (this.adresni_misto_code == null) {
            this.adresni_misto_code = ModsUtils.createTextElement('', { 'authority': 'RUIAN_CODE:ADRESNI_MISTO' });
            geographics.push(this.adresni_misto_code);
        }
    }

    public clear() {
        this.stat['_'] = ''; 
        this.kraj_1960['_'] = ''; 
        this.region_soudrznosti['_'] = ''; 
        this.okres['_'] = ''; 
        this.vusc['_'] = ''; 
        this.orp['_'] = ''; 
        this.pou['_'] = ''; 
        this.obec['_'] = ''; 
        this.zsj['_'] = ''; 
        this.katastralni_uzemi['_'] = ''; 
        this.cast_obce['_'] = ''; 
        this.ulice['_'] = ''; 
        this.adresni_misto['_'] = ''; 
        this.stat_code['_'] = ''; 
        this.kraj_1960_code['_'] = ''; 
        this.region_soudrznosti_code['_'] = ''; 
        this.okres_code['_'] = ''; 
        this.vusc_code['_'] = ''; 
        this.orp_code['_'] = ''; 
        this.pou_code['_'] = ''; 
        this.obec_code['_'] = ''; 
        this.zsj_code['_'] = ''; 
        this.katastralni_uzemi_code['_'] = ''; 
        this.cast_obce_code['_'] = ''; 
        this.ulice_code['_'] = ''; 
        this.adresni_misto_code['_'] = ''; 
        this.coordinates['_'] = '';
    }

}
