var APP_GLOBAL = {
    // proarcUrl: "http://proarc.inovatika.dev/api",
    proarcUrl: "/api",
  ga: "UA-159265713-1",
  exports:[
    'archive',
    'archive_bagit',
    'archive_stt',
    'archive_stt_bagit',
    'kramerius',
    'kramerius_bagit',
    'ndk_psp',
    'ndk_psp_bagit',
    'ndk_psp_upload_cesnet',
    'ndk_oldprint',
    'ndk_oldprint_bagit',
    'ndk_oldprint_upload_cesnet',
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
      'model:ndkmonographunit',
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
  lang: 'cs',
  expandedModels: ['model:ndkemonographvolume','model:ndkearticle'],
  showFooter: true,

  roleCodes: ['act', 'adp', 'ant', 'arr', 'aui', 'aut', 'cmp', 'cnd', 'com', 'cre', 'crp', 'dis', 'dnr', 'dst', 'dte',
    'dto', 'dub', 'edt', 'egr', 'fmo', 'fnd', 'ill', 'itr', 'lbt', 'lyr', 'mus', 'oth', 'pbl', 'prf', 'prt', 'rcd', 'red',
    'rev', 'sng', 'trl']
}
