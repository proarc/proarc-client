

export class ProArc {

    public static defaultModel = 'model:chroniclevolume';

    public static models = [
      'model:chroniclevolume',
      'model:chronicletitle',
      'model:chroniclesupplement',
      'model:ndkmonographvolume',
      'model:ndkmonographtitle',
      'model:ndkmonographsupplement',
      'model:ndkperiodical',
      'model:ndkperiodicalvolume',
      'model:ndkperiodicalissue',
      'model:ndkperiodicalsupplement',
      'model:ndkarticle',
      'model:ndkpicture',
      'model:ndkchapter',
      'model:ndkmap',
      'model:ndksheetmusic',
      'model:ndkpage',
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


    public static chronicleIdentifierTypes = [ 'signature1', 'signature2', 'inventaryNumber', 'OtherNumber' ];


    public static isChronicle(model: string): boolean {
      return model === 'model:chroniclevolume' || model === 'model:chronicletitle';
    }

}
