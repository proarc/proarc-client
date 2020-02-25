
import { Injectable } from '@angular/core';

@Injectable()
export class CodebookService {

    pageTypes = [
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


      identifierTypeCodes = [
          'barcode',
          'issn',
          'isbn',
          'isbn',
          'ccnb',
          'uuid',
          'urnnbn',
          'oclc',
          'sysno',
          'permalink',
          'sici',
          'id',
          'localId'
        ];

      titleTypeCodes = [
        'abbreviated',
        'translated',
        'alternative',
        'uniform'
      ];

}
