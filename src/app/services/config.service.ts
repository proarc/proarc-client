
import { Injectable } from '@angular/core';

declare var APP_GLOBAL: any;

@Injectable()
export class ConfigService {

	public mergeConfig(c: any) {
		const keys = Object.keys(c);
		keys.forEach(k => {
			APP_GLOBAL[k] = c[k];
		})
	}

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
    'manuscriptNotes',
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
		'ABA000', 'ABA001', 'ABA004', 'ABA006', 'ABA007', 'ABA008', 'ABA009', 'ABA010', 'ABA011', 'ABA013', 'ABB045',
		'ABC135', 'ABD001', 'ABD005', 'ABD020', 'ABD024', 'ABD025', 'ABD103', 'ABD134', 'ABE045', 'ABE050', 'ABE135',
		'ABE308', 'ABE310', 'ABE323', 'ABE336', 'ABE343', 'ABE345', 'ABE370', 'ABE459', 'ABG001', 'BOA001', 'BOA002',
		'BOB007', 'BOD006', 'BOE310', 'BOE801', 'BOE950', 'BVE301', 'CBA001', 'HBG001', 'HKA001', 'HKE302', 'HKG001',
		'HOE802', 'JCG001', 'JHE301', 'KLG001', 'KME301', 'KOE801', 'KTG503', 'KVG001', 'LIA001', 'OLA001', 'OPD001',
		'OPE301', 'OSA001', 'OSE309', 'PNA001', 'PNE303', 'ROE301', 'ULG001', 'UOG505', 'ZLE302', 'ZLG001'
	];

  private static defaultRoleCodes = ['act', 'adp', 'aft', 'ann', 'ant', 'app', 'aqt', 'arc', 'arr', 'art', 'asg', 'asn', 'att', 'auc', 'aud',
    'aui', 'aus', 'aut', 'bdd', 'bjd', 'bkd', 'bkp', 'bnd', 'bpd', 'bsl', 'ccp', 'chr', 'cli', 'cll', 'clt', 'cmm', 'cmp', 'cmt',
    'cnd', 'cns', 'coe', 'col', 'com', 'cos', 'cot', 'cov', 'cpc', 'cpe', 'cph', 'cpl', 'cpt', 'cre', 'crp', 'crr', 'csl',
    'csp', 'cst', 'ctb', 'cte', 'ctg', 'ctr', 'cts', 'ctt', 'cur', 'cwt', 'dfd', 'dfe', 'dft', 'dgg', 'dis', 'dln', 'dnc',
    'dnr', 'dpc', 'dpt', 'drm', 'drt', 'dsr', 'dst', 'dte', 'dto', 'dub', 'edt', 'egr', 'elt', 'eng', 'etr', 'exp', 'fac',
    'flm', 'fmo', 'fnd', 'frg', 'grt', 'hnr', 'hst', 'ill', 'ilu', 'ins', 'inv', 'itr', 'ive', 'ivr', 'lbt', 'lee', 'lel',
    'len', 'let', 'lie', 'lil', 'lit', 'lsa', 'lse', 'lso', 'ltg', 'lyr', 'mdc', 'mod', 'mon', 'mrk', 'mte', 'mus', 'nrt',
    'opn', 'org', 'orm', 'oth', 'own', 'pat', 'pbd', 'pbl', 'pfr', 'pht', 'plt', 'pop', 'ppm', 'prc', 'prd', 'prf', 'prg',
    'prm', 'pro', 'prt', 'pta', 'pte', 'ptf', 'pth', 'ptt', 'rbr', 'rce', 'rcp', 'red', 'ren', 'res', 'rev', 'rpt', 'rpy',
    'rse', 'rsp', 'rst', 'rth', 'rtm', 'sad', 'sce', 'scr', 'scl', 'sec', 'sgn', 'sng', 'spk', 'spn', 'srv', 'stn', 'stl',
    'str', 'ths', 'trc', 'trl', 'tyd', 'tyg', 'voc', 'wam', 'wdc', 'wde', 'wit'];

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
    'model:ndkmonographunit',
		'model:ndkchapter',
		'model:ndkmap',
    'model:ndkgraphic',
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
        'model:ndkeperiodicalsupplement',
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
		'archive_bagit',
		'archive_stt',
		'archive_stt_bagit',
		'kramerius',
		'kramerius_bagit',
		'ndk_psp',
		'ndk_psp_bagit',
    'ndk_psp_upload_cesnet',
    'ndk_psp_upload_kramerius',
    'ndk_oldprint',
		'ndk_oldprint_bagit',
    'ndk_oldprint_upload_cesnet',
    'ndk_oldprint_upload_kramerius',
		'datastream_full',
		'datastream_raw',
		'cejsh',
		'crossref',
		'kwis',


		'archive_extended', // - Archivace se surovými skeny
		'archive_stt_extended', // - Archivace starých tisků se surovými skeny
		'archive_extended_bagit', // - Archivace se surovými skeny v BAGIT balíčku
		'archive_stt_extended_bagit' // - Archivace starých tisků se surovými skeny v BAGIT balíčku


	];

	private static defaultProfiles = [
		'profile.default',
    'profile.defaultocr',
		'profile.createObjectWithMetadata_import',
    'profile.default_ndk_import',
		'profile.default_archive_import',
		'profile.soundrecording_import',
		'profile.default_kramerius_import',
		'profile.stt_kramerius_import',
		'profile.ndk_monograph_kramerius_import',
		'profile.ndk_periodical_kramerius_import',
		'profile.chronicle',
		'profile.oldprint',
    'profile.oldprintocr',
		'profile.replace_stream_import',
		'profile.ndk_full_import',
    'profile.generate',
		'exportProfile.kramerius',
		'exportProfile.ndk',
		'exportProfile.archive',
		'exportProfile.desa',
		'exportProfile.cejsh',
		'exportProfile.crossref',
		'exportProfile.kwis',
    'exportProfile.datastream',
		'internalProfile.reindex',
		'internalProfile.validation',
    'internalProfile.changeOwners',
    'internalProfile.urnnbn',
    'internalProfile.deletion',
    'uploadProfile.proarc',
    'uploadProfile.kramerius',
    'externalProfile.pero',
    'externalProfile.pdfa'
	]

	private static defaultIdentifiers = [ 'barcode', 'issn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'];
	private static defaultMusicIdentifiers = ['issue number', 'matrix number',  'barcode', 'issn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'];
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

	public topExpandedModels = APP_GLOBAL.topExpandedModels || [];
	public otherExpandedModels = ConfigService.defaultModels;

	public topLocations = APP_GLOBAL.topLocations || [];
	public otherLocations = APP_GLOBAL.locations || ConfigService.defaultLocations;

	public topIdentifiers = APP_GLOBAL.topIdentifiers || [];
	public otherIdentifiers = APP_GLOBAL.identifiers || ConfigService.defaultIdentifiers;

  public roleCodes = APP_GLOBAL.roleCodes || ConfigService.defaultRoleCodes;

	public topChronicleIdentifiers: any = [];
	public otherChronicleIdentifiers = APP_GLOBAL.chronicleIdentifiers || ConfigService.defaultChronicleIdentifiers;

	public topOldptintIdentifiers: any = [];
	public otherOldprintIdentifiers = APP_GLOBAL.oldprintIdentifiers || ConfigService.defaultOldprintIdentifiers;

	public topEDocumentsIdentifiers: any = [];
	public otherEDocumentsIdentifiers = APP_GLOBAL.eDocumentIdentifiers || ConfigService.defaultEDocumentsIdentifiers;

	public topMusicDocumentsIdentifiers: any = [];
	public otherMusicDocumentsIdentifiers = APP_GLOBAL.musicDocumentIdentifiers || ConfigService.defaultMusicIdentifiers;

	public organizations = APP_GLOBAL.organizations || [];
	public profiles = APP_GLOBAL.profiles || ConfigService.defaultProfiles;
	public exports = APP_GLOBAL.exports || ConfigService.defaultDefaultExports;
	public pagePositions = APP_GLOBAL.pagePositions || ConfigService.defaultPagePositions;

	public navbarColor = APP_GLOBAL.navbarColor;

	public static modelChangesDefault = [
    // origin = model nad kterym to lze spustit
    // originModel = vychozi model z ktereho se prevadi
    // model = model na ktery se prevadi

    // ndk
    {
    	origin: 'ndkmonographtitle',
    	dest: [
        {model: 'ndkmonographvolume', originmodel:"monographunit", apiPoint: "object/changeK4MonographUnitToNdkMonographVolume"},
        // {model: 'clippingstitle', apiPoint: "object/changeNdkMonographTitleToClippingsTitle"},
        {model: 'ndkmonographvolume', originmodel:"ndkmonographtitle", apiPoint: "object/changeNdkMonographTitleToNdkMonographVolume"},
        // {model: 'clippingsvolume', apiPoint: "object/changeNdkMonographVolumeToClippingsVolume"},
    		{model: 'ndkmonographtitle', originmodel:"ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToNdkMonographTitle"},
        {model: 'ndkmonographunit', originmodel: "ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToNdkMonographUnit"},
    	]
    },
    {
    	origin: 'ndkmonographvolume',
    	dest: [
        {model: 'ndkmonographunit', originmodel: "ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToNdkMonographUnit"},
        // {model: 'clippingsvolume', apiPoint: "object/changeNdkMonographVolumeToClippingsVolume"},
        {model: 'ndkmonographtitle', originmodel:"ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToNdkMonographTitle"},
        {model: 'oldprintvolume', originmodel:"ndkmonographvolume", apiPoint: "object/changeNdkMonographVolumeToOldPrintMonographVolume"},
    	]
    },
    {
      origin: 'ndkmonographunit',
      dest: [
        {model: 'ndkmonographvolume', originmodel: "ndkmonographunit", apiPoint: "object/changeNdkMonographUnitToNdkMonographVolume"},
      ]
    },
    {
      origin: 'ndkmonographsupplement',
      dest: [
        {model: 'oldprintsupplement', originmodel:"ndkmonographsupplement", "apiPoint": "object/changeNdkMonographSupplementToOldPrintMonographSupplement"}
      ]
    },
    {
    	origin: 'ndkperiodical',
    	dest: [
        {model: 'ndkeperiodical', originmodel:"ndkperiodical", apiPoint: "object/changeNdkPeriodicalToNdkEPeriodical"},
        {model: 'ndkeperiodicalvolume', originmodel:"ndkperiodicalvolume", apiPoint: "object/changeNdkPeriodicalVolumeToNdkEPeriodicalVolume"},
        {model: 'ndkeperiodicalissue', originmodel:"ndkperiodicalissue", apiPoint: "object/changeNdkPeriodicalIssueToNdkEPeriodicalIssue"},
        {model: 'ndkeperiodicalsupplement', originmodel:"ndkperiodicalsupplement", apiPoint: "object/changeNdkPeriodicalSupplementToNdkEPeriodicalSupplement"},
        {model: 'ndkearticle', originmodel:"ndkarticle", apiPoint: "object/changeNdkArticleToNdkEArticle"},
        {model: 'ndkearticle', originmodel:"bdmarticle", apiPoint: "object/changeBdmArticleToNdkEArticle"},
        {model: 'ndkperiodicalvolume', originmodel:"periodicalvolume", apiPoint: "object/changeK4PeriodicalVolumeToNdkPeriodicalVolume"},
        {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},

    	]
    },
    {
    	origin: 'ndkperiodicalvolume',
    	dest: [
        {model: 'ndkeperiodicalvolume', originmodel:"ndkperiodicalvolume", apiPoint: "object/changeNdkPeriodicalVolumeToNdkEPeriodicalVolume"},
        {model: 'ndkeperiodicalissue', originmodel:"ndkperiodicalissue", apiPoint: "object/changeNdkPeriodicalIssueToNdkEPeriodicalIssue"},
        {model: 'ndkeperiodicalsupplement', originmodel:"ndkperiodicalsupplement", apiPoint: "object/changeNdkPeriodicalSupplementToNdkEPeriodicalSupplement"},
        {model: 'ndkearticle', originmodel:"ndkarticle", apiPoint: "object/changeNdkArticleToNdkEArticle"},
        {model: 'ndkearticle', originmodel:"bdmarticle", apiPoint: "object/changeBdmArticleToNdkEArticle"},
        {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
    	]
    },
    {
    	origin: 'ndkperiodicalissue',
    	dest: [
        {model: 'ndkeperiodicalissue', originmodel:"ndkperiodicalissue", apiPoint: "object/changeNdkPeriodicalIssueToNdkEPeriodicalIssue"},
        {model: 'ndkeperiodicalsupplement', originmodel:"ndkperiodicalsupplement", apiPoint: "object/changeNdkPeriodicalSupplementToNdkEPeriodicalSupplement"},
        {model: 'ndkearticle', originmodel:"ndkarticle", apiPoint: "object/changeNdkArticleToNdkEArticle"},
        {model: 'ndkearticle', originmodel:"bdmarticle", apiPoint: "object/changeBdmArticleToNdkEArticle"},
    	]
    },
    {
    	origin: 'ndkperiodicalsupplement',
    	dest: [
        {model: 'ndkeperiodicalsupplement', originmodel:"ndkperiodicalsupplement", apiPoint: "object/changeNdkPeriodicalSupplementToNdkEPeriodicalSupplement"},
        {model: 'ndkearticle', originmodel:"ndkarticle", apiPoint: "object/changeNdkArticleToNdkEArticle"},
        {model: 'ndkearticle', originmodel:"bdmarticle", apiPoint: "object/changeBdmArticleToNdkEArticle"},
    	]
    },
    {
    	origin: 'ndkarticle',
    	dest: [
        {model: 'ndkearticle', originmodel:"ndkarticle", apiPoint: "object/changeNdkArticleToNdkEArticle"},
    	]
    },
    {
    	origin: 'bdmarticle',
    	dest: [
        {model: 'ndkearticle', originmodel:"bdmarticle", apiPoint: "object/changeBdmArticleToNdkEArticle"},
    	]
    },
    {
      origin: 'ndkmap',
      dest: [
        {model: 'oldprintmap', originmodel:"ndkmap", "apiPoint": "object/changeNdkCartographicToOldPrintCartographic"}
      ]
    },
    {
      origin: 'ndkchapter',
      dest: [
        {model: 'oldprintchapter', originmodel:"ndkchapter", "apiPoint": "object/changeNdkChapterToOldPrintChapter"}
      ]
    },
    {
      origin: 'ndksheetmusic',
      dest: [
        {model: 'oldprintsheetmusic', originmodel:"ndksheetmusic", "apiPoint": "object/changeNdkMusicSheetToOldPrintMusicSheet"}
      ]
    },
    {
      origin: 'ndkpicture',
      dest: [
        {model: 'oldprintgraphics', originmodel:"ndkpicture", "apiPoint": "object/changeNdkPictureToOldPrintGraphic"}
      ]
    },

    // oldprint
    {
      origin: 'oldprintmap',
      dest: [
        {model: 'ndkmap', originmodel:"oldprintmap", "apiPoint": "object/changeOldPrintCartographicToNdkCartographic"}
      ]
    },
    {
      origin: 'oldprintchapter',
      dest: [
        {model: 'ndkchapter', originmodel:"oldprintchapter", "apiPoint": "object/changeOldPrintChapterToNdkChapter"}
      ]
    },
    {
      origin: 'oldprintsupplement',
      dest: [
        {model: 'ndkmonographsupplement', originmodel:"oldprintsupplement", "apiPoint": "object/changeOldPrintMonographSupplementToNdkMonographSupplement"}
      ]
    },
    {
      origin: 'oldprintsheetmusic',
      dest: [
        {model: 'ndksheetmusic', originmodel:"oldprintsheetmusic", "apiPoint": "object/changeOldPrintMusicSheetToNdkMusicSheet"}
      ]
    },
    {
      origin: 'oldprintgraphics',
      dest: [
        {model: 'ndkpicture', originmodel:"oldprintgraphics", "apiPoint": "object/changeOldPrintGraphicToNdkPicture"},
        {model: 'oldprintvolume', originmodel:"oldprintgraphics", "apiPoint": "object/changeOldPrintGraphicToOldprintMonographVolume"}
      ]
    },
    {
      origin: 'oldprintvolume',
      dest: [
        {model: 'ndkmonographvolume', originmodel:"oldprintvolume", "apiPoint": "object/changeOldPrintMonographVolumeToNdkMonographVolume"},
        {model: 'oldprintgraphics', originmodel:"oldprintvolume", "apiPoint": "object/changeOldPrintMonographVolumeToOldPrintGraphic"},
        {model: 'oldprintsheetmusic', originmodel:"oldprintvolume", "apiPoint": "object/changeOldPrintMonographVolumeToOldPrintMusicSheet"}
      ]
    },

    // k4
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
        {model: 'ndkmonographunit', originmodel:"monographunit", apiPoint: "object/changeK4MonographUnitToNdkMonographUnit"},
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
    	origin: 'periodicalitem',
    	dest: [
        {model: 'ndkperiodicalissue', originmodel:"periodicalissue", apiPoint: "object/changeK4PeriodicalIssueToNdkPeriodicalIssue"},
    	]
    },


    // clippings
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
	];

	public modelChanges = ConfigService.modelChangesDefault || [];

	public showFooter = !!APP_GLOBAL.showFooter;
	public expandedModels = !!APP_GLOBAL.expandedModels;

	private static donators = [ 'ilnorway', 'norway', 'dkrvo19-23', 'dkrvo24-28'];
	public donators = APP_GLOBAL.donators || ConfigService.donators;

	public updateInSource = !!APP_GLOBAL.updateInSource;
	public updateInSourceModels: string[] = APP_GLOBAL.updateInSourceModels;

	public valueMap: {mapId: string, values: any[]}[];

	constructor() {
	}

	public getValueMap(mapId: string): any[] {
		// imageColor obcas vraci code a obcas value !!
		// const ic = this.parameters.find((p: any) => p.valueMapId === 'wf.valuemap.imageColor');
		// if (ic) {
		//   this.imageColor = this.imageColors.find(c => c.value === ic.value || c.code === ic.value).code;
		// }
		return this.valueMap.find(m => m.mapId === mapId).values;
	}



}
