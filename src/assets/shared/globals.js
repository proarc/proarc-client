var APP_GLOBAL = {
    // proarcUrl: "http://proarc.inovatika.dev/api",
    proarcUrl: "/api",
  ga: "UA-159265713-1",
  exports:[
    'archive',
    'archive_stt',
    'kramerius',
		'kramerius_bagit',
    'ndk_psp',
    'datastream_full',
    'datastream_raw',
    'cejsh',
    'crossref',
    'kwis'
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
  ],
  defaultModel: 'model:ndkperiodical',
  showCommentEditor: true,
  showWorkflow: true,
  topPageTypes: [
      'normalPage',
      'blank'
  ],
  topLanguages: ['cze', 'ger', 'lat'],
  languages: ['cze', 'eng', 'fre', 'heb', 'ita', 'pol', 'por', 'rus', 'gre', 'slo', 'grc', 'spa', 'mul', 'zxx'],
  topLocations: ['BOA001', 'ABA000'],
  identifiers: [ 'barcode', 'issn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'],
  pagePositions: ['right_left', 'left_right', 'left', 'right', 'singlePage'],
  lang: 'en',
  expandedModels: ['model:ndkemonographvolume','model:ndkearticle'],
  showFooter: true,

  roleCodes: ['act', 'adp', 'ant', 'arr', 'aui', 'aut', 'cmp', 'cnd', 'com', 'cre', 'crp', 'dis', 'dnr', 'dst', 'dte',
    'dto', 'dub', 'edt', 'egr', 'fmo', 'fnd', 'ill', 'itr', 'lbt', 'lyr', 'mus', 'oth', 'pbl', 'prf', 'prt', 'rcd', 'red',
    'rev', 'sng', 'trl']
}
