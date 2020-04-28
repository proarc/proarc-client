
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

    public proarcBackendUrl = APP_GLOBAL.proarcUrl;
    public allModels = APP_GLOBAL.models;
    public defaultModel = APP_GLOBAL.defaultModel;

    public showPageIdentifiers = APP_GLOBAL.showPageIdentifiers == undefined ? true : !!APP_GLOBAL.showPageIdentifiers;
    public showPageIndex = APP_GLOBAL.showPageIndex == undefined ? true : !!APP_GLOBAL.showPageIndex;

    public topPageTypes = APP_GLOBAL.topPageTypes || [];
    public pageTypes = APP_GLOBAL.pageTypes || ConfigService.defaultPageTypes;

    constructor() {
    }

}
