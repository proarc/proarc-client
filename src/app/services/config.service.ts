
import { Injectable } from '@angular/core';

declare var APP_GLOBAL: any;

@Injectable()
export class ConfigService {

    private static defaultPageTypes = [
        'normalPage',
        'abstract',
        'anotation',
        'bibliography',
        'bibliographicalPortrait',
        'booklet',
        'colophon',
        'dedication',
        'cover',
        'appendix',
        'editorial',
        'errata',
        'frontispiece',
        'mainArticle',
        'spine',
        'illustration',
        'imgDisc',
        'impressum',
        'interview',
        'calibrationTable',
        'map',
        'normalPage',
        'sheetmusic',
        'obituary',
        'tableOfContents',
        'edge',
        'case',
        'imprimatur',
        'blank',
        'jacket',
        'preface',
        'frontCover',
        'frontEndPaper',
        'frontEndSheet',
        'frontJacket',
        'index',
        'advertisement',
        'review',
        'listOfIllustrations',
        'listOfMaps',
        'listOfSupplements',
        'listOfTables',
        'table',
        'titlePage',
        'introduction',
        'flyLeaf',
        'backCover',
        'backEndPaper',
        'backEndSheet'
    ];

    private static defaultLanguages = [
        'aar', 'abk', 'ave', 'afr', 'aka', 'amh', 'arg', 'ara', 'asm', 'ava', 'aym', 'aze', 'bak', 'bel', 'bul', 'bih',
        'bis', 'bam', 'ben', 'tib', 'bre', 'bos', 'cat', 'che', 'cha', 'cos', 'cre', 'cze', 'chu', 'chv',
        'wel', 'dan', 'ger', 'div', 'dzo', 'ewe', 'gre', 'eng', 'epo', 'spa', 'est', 'baq',
        'per', 'ful', 'fin', 'fij', 'fao', 'fre', 'fry', 'gle', 'gla', 'glg', 'grn', 'guj', 'glv', 'hau',
        'heb', 'hin', 'hmo', 'hrv', 'hat', 'hun', 'arm', 'her', 'ina', 'ind', 'ile', 'ibo', 'iii', 'ipk',
        'ido', 'ice', 'ita', 'iku', 'jpn', 'jav', 'geo', 'kon', 'kik', 'kua', 'kaz', 'kal', 'khm', 'kan',
        'kor', 'kau', 'kas', 'kur', 'kom', 'cor', 'kir', 'lat', 'ltz', 'lug', 'lim', 'lin', 'lao', 'lit', 'lub', 'lav',
        'mlg', 'mah', 'mao', 'mac', 'mal', 'mon', 'mar', 'may', 'mlt', 'bur', 'nau',
        'nob', 'nde', 'nep', 'ndo', 'dut', 'nno', 'nor', 'nbl', 'nav', 'nya', 'oci', 'oji', 'orm', 'ori', 'oss',
        'pan', 'pli', 'pol', 'pus', 'por', 'que', 'roh', 'run', 'rum', 'rus', 'kin', 'san', 'srd', 'snd', 'sme',
        'sag', 'sin', 'slo', 'slv', 'smo', 'sna', 'som', 'alb', 'srp', 'ssw', 'sot', 'sun', 'swe',
        'swa', 'tam', 'tel', 'tgk', 'tha', 'tir', 'tuk', 'tgl', 'tsn', 'ton', 'tur', 'tso', 'tat', 'twi', 'tah', 'uig',
        'ukr', 'urd', 'uzb', 'ven', 'vie', 'vol', 'wln', 'wol', 'xho', 'yid', 'yor', 'zha', 'chi', 'zul', 'grc',
        'zxx', 'tai', 'und', 'sla', 'mul', 'inc', 'akk', 'arc', 'rom', 'egy', 'wen', 'egy', 'sux', 'frm', 'syr', 'fro',
        'cop', 'mis', 'ine', 'dum', 'hit', 'ira', 'haw'
    ];

    private static defaultIdentifiers = [ 'barcode', 'issn', 'isbn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'];
    private static defaultChronicleIdentifiers = [ 'signature1', 'signature2', 'inventaryNumber', 'OtherNumber'];


    public proarcBackendUrl = APP_GLOBAL.proarcUrl;
    public allModels = APP_GLOBAL.models;
    public defaultModel = APP_GLOBAL.defaultModel;

    public showPageIdentifiers = APP_GLOBAL.showPageIdentifiers == undefined ? true : !!APP_GLOBAL.showPageIdentifiers;
    public showPageIndex = APP_GLOBAL.showPageIndex == undefined ? true : !!APP_GLOBAL.showPageIndex;

    public showCommentEditor = APP_GLOBAL.showCommentEditor == undefined ? true : !!APP_GLOBAL.showCommentEditor;
    public showGeoEditor = APP_GLOBAL.showGeoEditor == undefined ? false : !!APP_GLOBAL.showGeoEditor;

    public topPageTypes = APP_GLOBAL.topPageTypes || [];
    public otherPageTypes = APP_GLOBAL.pageTypes || ConfigService.defaultPageTypes;

    public topLanguages = APP_GLOBAL.topLanguages || [];
    public otherLanguages = APP_GLOBAL.languages || ConfigService.defaultLanguages;

    public topIdentifiers = APP_GLOBAL.topIdentifiers || [];
    public otherIdentifiers = APP_GLOBAL.identifiers || ConfigService.defaultIdentifiers;

    public topChronicleIdentifiers = [];
    public otherChronicleIdentifiers = APP_GLOBAL.chronicleIdentifiers || ConfigService.defaultChronicleIdentifiers;

    public organizations = APP_GLOBAL.organizations || [];
    public exports = APP_GLOBAL.exports || [];

    constructor() {
    }

}
