
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
        'fragmentsOfBookbinding',
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

    private static defaultLocations = [
        'BOA001', 'BOE801', 'ABA000', 'ABA001', 'ABA004', 'BVE301', 'CBA001', 'OLA001', 'HKA001', 'ULG001', 'ABA007',
        'KVG001', 'ABA013', 'ABE310', 'ROE301', 'ABD103', 'ABG001', 'LIA001', 'KLG001', 'ZLG001', 'ABA009', 'BOE950',
        'UOG505', 'KTG503', 'ABE308', 'ABA010', 'ABE045', 'ABC135', 'ABE323', 'PNA001', 'OSA001', 'OSE309', 'BOD006',
        'ABD001', 'ABA006', 'ABA008', 'ABE343', 'ABE459', 'HOE802', 'ABA011', 'BOA002', 'ABB045', 'ABE050', 'ABD005',
        'HBG001', 'KOE801', 'OPE301', 'HKE302', 'HKG001', 'JCG001', 'ABD025', 'KME301', 'ZLE302', 'BOB007', 'BOE310',
        'ABD020', 'ABE135', 'ABE345', 'ABE370', 'ABE336', 'ABD024', 'ABD134', 'PNE303', 'OPD001', 'JHE301'
    ];

    private static defaultModels = [
        'model:ndkperiodical',
        'model:ndkperiodicalvolume',
        'model:ndkperiodicalissue',
        'model:ndkperiodicalsupplement',
        'model:ndkarticle',
        'model:ndkpicture',
        'model:ndkmonographtitle',
        'model:ndkmonographvolume',
        'model:ndkmonographsupplement',
        'model:ndkchapter',
        'model:ndkmap',
        'model:ndksheetmusic',
        'model:ndkpage',
        'model:page',
        'model:oldprintomnibusvolume',
        'model:oldprintmonographtitle',
        'model:oldprintvolume',
        'model:oldprintsupplement',
        'model:oldprintchapter',
        'model:oldprintgraphics',
        'model:oldprintmap',
        'model:oldprintsheetmusic',
        'model:oldprintpage',
        'model:ndkeperiodical',
        'model:ndkeperiodicalvolume',
        'model:ndkeperiodicalissue',
        'model:ndkearticle',
        'model:ndkemonographtitle',
        'model:ndkemonographvolume',
        'model:ndkechapter',
        'model:ndkphonographcylinder',
        'model:ndkmusicdocument',
        'model:ndksong',
        'model:ndktrack',
        'model:ndkaudiopage',
        'model:chronicletitle',
        'model:chroniclevolume',
        'model:chroniclesupplement',
        'model:bdmarticle'
    ];

    private static defaultDefaultModel = 'model:ndkmonographvolume';

    private static defaultAllowedCopyModels = ['model:ndkmonographvolume', 'model:ndkperiodicalissue', 'model:oldprintvolume'];

    private static defaultDefaultExports = [
        'archive',
        'archive_stt',
        'kramerius',
        'ndk_psp',
        'datastream_full',
        'datastream_raw',
        'cejsh',
        'crossref',
        'kwis'
    ];

    private static defaultIdentifiers = [ 'barcode', 'issn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'];
    private static defaultChronicleIdentifiers = [ 'signature1', 'signature2', 'inventaryNumber', 'OtherNumber' , 'id', 'localId', 'officialNumber'];
    private static defaultEDocumentsIdentifiers = [ 'doi', 'handle', 'ismn', 'url', 'barcode', 'issn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici'];
    private static defaultOldprintIdentifiers = ['barcode', 'ccnb', 'doi', 'hdl', 'ismn', 'isbn', 'permalink', 'sici', 'url',  'uuid', 'urnnbn', 'BCBT'];
    private static defaultPagePositions = ['right_left', 'left_right', 'left', 'right', 'singlePage'];

    public proarcBackendUrl = APP_GLOBAL.proarcUrl;
    public allModels = APP_GLOBAL.models || ConfigService.defaultModels;
    public defaultModel = APP_GLOBAL.defaultModel || ConfigService.defaultDefaultModel;
    public allowedCopyModels = APP_GLOBAL.allowedCopyModels || ConfigService.defaultAllowedCopyModels;

    public showPageIdentifiers = APP_GLOBAL.showPageIdentifiers == undefined ? true : !!APP_GLOBAL.showPageIdentifiers;
    public showPageIndex = APP_GLOBAL.showPageIndex == undefined ? true : !!APP_GLOBAL.showPageIndex;

    public showCommentEditor = APP_GLOBAL.showCommentEditor == undefined ? true : !!APP_GLOBAL.showCommentEditor;
    public showGeoEditor = APP_GLOBAL.showGeoEditor == undefined ? false : !!APP_GLOBAL.showGeoEditor;
    public showWorkflow = APP_GLOBAL.showWorkflow == undefined ? false : !!APP_GLOBAL.showWorkflow;

    public workflowUrl = this.proarcBackendUrl + "/#workflow:%7B%22type%22:%22JOBS%22%7D";

    public topPageTypes = APP_GLOBAL.topPageTypes || [];
    public otherPageTypes = APP_GLOBAL.pageTypes || ConfigService.defaultPageTypes;

    public topLanguages = APP_GLOBAL.topLanguages || [];
    public otherLanguages = APP_GLOBAL.languages || ConfigService.defaultLanguages;

    public topLocations = APP_GLOBAL.topLocations || [];
    public otherLocations = APP_GLOBAL.locations || ConfigService.defaultLocations;

    public topIdentifiers = APP_GLOBAL.topIdentifiers || [];
    public otherIdentifiers = APP_GLOBAL.identifiers || ConfigService.defaultIdentifiers;

    public topChronicleIdentifiers: any = [];
    public otherChronicleIdentifiers = APP_GLOBAL.chronicleIdentifiers || ConfigService.defaultChronicleIdentifiers;

    public topOldptintIdentifiers: any = [];
    public otherOldprintIdentifiers = APP_GLOBAL.oldprintIdentifiers || ConfigService.defaultOldprintIdentifiers;

    public topEDocumentsIdentifiers: any = [];
    public otherEDocumentsIdentifiers = APP_GLOBAL.eDocumentIdentifiers || ConfigService.defaultEDocumentsIdentifiers;

    public organizations = APP_GLOBAL.organizations || [];
    public exports = APP_GLOBAL.exports || ConfigService.defaultDefaultExports;
    public pagePositions = APP_GLOBAL.pagePositions || ConfigService.defaultPagePositions;

    public static modelChangesDefault = [
        {
            origin: 'clippingstitle',
            dest: [
                {model: 'ndkmonographtitle', apiPoint: "object/changeClippingsTitleToNdkMonographTitle"},
				{model: 'ndkmonographvolume', apiPoint: "object/changeClippingsVolumeToNdkMonographVolume"},
            ]
        },
        {
            origin: 'clippingsvolume',
            dest: [
                {model: 'ndkmonographvolume', apiPoint: "object/changeClippingsVolumeToNdkMonographVolume"},
            ]
        },
		{
            origin: 'monograph',
            dest: [
                {model: 'ndkmonographvolume', originmodel:"monograph", apiPoint: "object/changeK4MonographToNdkMonographVolume"},
				{model: 'ndkmonographvolume', originmodel:"monographunit", apiPoint: "object/changeK4MonographUnitToNdkMonographVolume"},
            ]
        },
		{
            origin: 'monographunit',
            dest: [
                {model: 'ndkmonographvolume', originmodel:"monographunit", apiPoint: "object/changeK4MonographUnitToNdkMonographVolume"},
            ]
        },
		{
            origin: 'ndkmonographvolume',
            dest: [
                {model: 'ndkmonographvolume', originmodel:"monographunit", apiPoint: "object/changeK4MonographUnitToNdkMonographVolume"},
				// {model: 'clippingsvolume', apiPoint: "object/changeNdkMonographVolumeToClippingsVolume"},
				{model: 'ndkmonographtitle', originmodel:"ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToNdkMonographTitle"},
            ]
        },
		{
            origin: 'ndkmonographtitle',
            dest: [
                {model: 'ndkmonographvolume', originmodel:"monographunit", apiPoint: "object/changeK4MonographUnitToNdkMonographVolume"},
				// {model: 'clippingstitle', apiPoint: "object/changeNdkMonographTitleToClippingsTitle"},
				{model: 'ndkmonographvolume', originmodel:"ndkmonographtitle", apiPoint: "object/changeNdkMonographTitleToNdkMonographVolume"},
				// {model: 'clippingsvolume', apiPoint: "object/changeNdkMonographVolumeToClippingsVolume"},
				{model: 'ndkmonographtitle', originmodel:"ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToNdkMonographTitle"},
            ]
        },
		{
            origin: 'periodicalitem',
            dest: [
                {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
            ]
        },
		{
            origin: 'ndkperiodicalvolume',
            dest: [
                {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
            ]
        },
		{
            origin: 'periodicalvolume',
            dest: [
                {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
				{model: 'ndkperiodicalvolume', originmodel:"periodicalvolume", apiPoint: "object/changeK4PeriodicalVolumeToNdkPeriodicalVolume"},
            ]
        },
		{
            origin: 'periodical',
            dest: [
                {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
				{model: 'ndkperiodical', originmodel:"periodical", apiPoint: "object/changeK4PeriodicalToNdkPeriodical"},
				{model: 'ndkperiodicalvolume', originmodel:"periodicalvolume", apiPoint: "object/changeK4PeriodicalVolumeToNdkPeriodicalVolume"},
            ]
        },
		{
            origin: 'ndkperiodical',
            dest: [
                {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
				{model: 'ndkperiodicalvolume', originmodel:"periodicalvolume", apiPoint: "object/changeK4PeriodicalVolumeToNdkPeriodicalVolume"},
            ]
        }
    ];

    public modelChanges = ConfigService.modelChangesDefault || [];

    constructor() {
    }

}
