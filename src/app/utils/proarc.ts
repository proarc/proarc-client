

export class ProArc {

    public static EXPORT_DATASTREAM_FULL = 'datastream_full';
    public static EXPORT_DATASTREAM_RAW = 'datastream_raw';
    public static EXPORT_KRAMERIUS = 'kramerius';
    public static EXPORT_ARCHIVE = 'archive';
    public static EXPORT_NDK_PSP = 'ndk_psp';
    public static EXPORT_CEJSH = 'cejsh';
    public static EXPORT_CROSSREF = 'crossref';

    public static chronicleIdentifierTypes = [ 'signature1', 'signature2', 'inventaryNumber', 'OtherNumber' ];

    public static isChronicle(model: string): boolean {
      return model === 'model:chroniclevolume' || model === 'model:chronicletitle';
    }

}
