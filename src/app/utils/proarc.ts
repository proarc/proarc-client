

export class ProArc {

    public static defaultModel = 'model:ndkperiodical';

    public static models = [
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
      'model:periodical',
      'model:periodicalvolume',
      'model:periodicalitem',
      'model:chroniclevolume',
      'model:monograph',
      'model:monographunit',
      'model:page',
    ];

    public static EXPORT_DATASTREAM_FULL = 'datastream_full';
    public static EXPORT_DATASTREAM_RAW = 'datastream_raw';
    public static EXPORT_KRAMERIUS = 'kramerius';
    public static EXPORT_ARCHIVE = 'archive';
    public static EXPORT_NDK_PSP = 'ndk_psp';
    public static EXPORT_CEJSH = 'cejsh';
    public static EXPORT_CROSSREF = 'crossref';

    public static exports = [
      ProArc.EXPORT_DATASTREAM_FULL, 
      ProArc.EXPORT_DATASTREAM_RAW, 
      ProArc.EXPORT_KRAMERIUS,
      ProArc.EXPORT_ARCHIVE,
      ProArc.EXPORT_NDK_PSP,
      ProArc.EXPORT_CEJSH,
      ProArc.EXPORT_CROSSREF
    ];

}
