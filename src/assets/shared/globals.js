var APP_GLOBAL = {
    // proarcUrl: "http://proarc.inovatika.dev/api",
    proarcUrl: "/api",
  ga: "UA-159265713-1",
  exports:[
    'archive',    // archivni export
    'archive_extended',   // archivni export s pridanim slozky surovych skenu
    'archive_bagit',  // archivni export prevedeny do podoby BagIt balicku
    'archive_extended_bagit', //archivni export s pridanim slozky surovych skenu prevedeny do podoby BagIt balicku
    'archive_stt',  // archivni export starych tisku
    'archive_stt_bagit',  // archivni export starych tisku prevedeny do podoby BagIt balicku
    'archive_stt_extended',   // archivni export starych tisku s pridanim slozky surovych skenu
    'archive_stt_extended_bagit',   // archivni export starych tisku s pridanim slozky surovych skenu prevedeny do podoby BagIt balicku
    'kramerius',    // export foxml pro kramerius
    'kramerius_bagit',    // export foxml pro kramerius prevedeny do podoby BagIt balicku
    'ndk_psp',    // ndk export pro tistene a zvukove dokumenty
    'ndk_psp_bagit',    // ndk export pro tistene a zvukove dokumenty prevedeny do podoby BagIt balicku
    'ndk_psp_upload_cesnet',    // ndk export pro tistene a zvukove dokumenty prevedeny do podoby BagIt balicku a nahrany na LTP Cesnet
    'ndk_psp_upload_kramerius',    // ndk export pro tistene a zvukove dokumenty nahrany do Krameria
    'ndk_oldprint',    // ndk export pro stare tisky
    'ndk_oldprint_bagit',    // ndk export pro stare tisky prevedeny do podoby BagIt balicku
    'ndk_oldprint_upload_cesnet',    // ndk export pro stare tisky prevedeny do podoby BagIt balicku a nahrany na LTP Cesnet
    'ndk_oldprint_upload_kramerius',    // ndk export pro stare tisky nahrany do Krameria
    'ndk_sip',    // ndk export pro eleketornicke dokumenty
    'ndk_sip_bagit',    // ndk export pro eleketornicke dokumenty prevedeny do podoby BagIt balicku
    'ndk_sip_upload_kramerius',    // ndk export pro eleketornicke dokumenty nahrany do Krameria
    'datastream_full', // export datastreamu FULL (u tistenych dokumentu export jpg, u pdf export pdf)
    'datastream_raw', // export datastreamu RAW (export vstupnich formatu - tiff, pdf, wave, mp3)
    'datastream_ndkUser', // export uzivatelske kopie (jp2, pdf)
    'cejsh', // export pro Cejsh
    'crossref', // export pro Crossref
    'kwis', // export foxml pro kramerius a spusteni nasledneho merlin scriptu (pouze pro kramerius 5)
  ],
  organizations: [
      'ABA007',
      'BOA001',
      'ABA010',
      'ABA012',
      'HKA001',
      'ABE301',
      'ABG001',
      'ABD068',
      'ABD103',
      'PAG001',
      'JIG001',
      "Inovatika"
  ],
  models: [
      'model:bdmarticle',
      'model:ndkperiodical',
      'model:ndkperiodicalvolume',
      'model:ndkperiodicalissue',
      'model:ndkperiodicalsupplement',
      'model:ndkarticle',
      'model:ndkpicture',
      'model:ndkmonographvolume',
      'model:ndkmonographtitle',
      'model:ndkmonographunit',
      'model:ndkmonographsupplement',
      'model:ndkchapter',
      'model:ndkmap',
      'model:ndkgraphic',
      'model:ndksheetmusic',
      'model:ndkpage',
      'model:page',
      'model:oldprintomnibusvolume',
      'model:oldprintmonographtitle',
      'model:oldprintmonographunit',
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
      'model:ndkemonographsupplement',
      'model:ndkechapter',
      'model:ndkphonographcylinder',
      'model:ndkmusicdocument',
      'model:ndksong',
      'model:ndktrack',
      'model:ndkaudiopage',
      'model:chronicletitle',
      'model:chroniclevolume',
      'model:chroniclesupplement',
      'model:ndkclippingcollection',
      'model:ndkclippingdirectory',
      'model:ndkclippingunit',
  ],
  defaultModel: 'model:ndkperiodical',
  showCommentEditor: true,
  showWorkflow: true,
  showLogoutCounter: true,
  topPageTypes: [
      'normalPage',
      'blank'
  ],
  topLanguages: ['cze', 'ger', 'lat'],
  languages: ['cze', 'eng', 'fre', 'heb', 'ita', 'pol', 'por', 'rus', 'gre', 'slo', 'grc', 'spa', 'mul', 'zxx'],
  topLocations: ['BOA001', 'ABA000'],
  identifiers: [ 'barcode', 'issn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'],
  pagePositions: ['right_left', 'left_right', 'left', 'right', 'singlePage'],
  lang: 'cs-en',
  expandedModels: ['model:ndkemonographvolume','model:ndkearticle'],
  showFooter: true,

  roleCodes: ['act', 'adp', 'ant', 'arr', 'aui', 'aut', 'cmp', 'cnd', 'com', 'cre', 'crp', 'dis', 'dnr', 'dst', 'dte',
    'dto', 'dub', 'edt', 'egr', 'fmo', 'fnd', 'ill', 'itr', 'lbt', 'lyr', 'mus', 'oth', 'pbl', 'prf', 'prt', 'rcd', 'red',
    'rev', 'sng', 'trl'],
  updateInSource: true,
  updateInSourceModels: ['model:ndkperiodical','model:ndkmonographvolume', 'model:ndkmusicdocument', 'model:ndkphonographcylinder', 'model:ndkmap',
  'model:ndksheetmusic', 'model:oldprintgraphics', 'model:ndkmonographtitle'],

  searchExpandTree: true

  // navbarColor: '#442200'
}
