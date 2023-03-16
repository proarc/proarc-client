

export class ProArc {

    public static EXPORT_DATASTREAM_FULL = 'datastream_full';
    public static EXPORT_DATASTREAM_RAW = 'datastream_raw';
    public static EXPORT_KRAMERIUS = 'kramerius';
    public static EXPORT_ARCHIVE = 'archive';
    public static EXPORT_ARCHIVE_OLDPRINT = 'archive_stt';
    public static EXPORT_NDK_PSP = 'ndk_psp';
    public static EXPORT_ARCHIVE_BAGIT = 'archive_bagit';
    public static EXPORT_ARCHIVE_OLDPRINT_BAGIT = 'archive_stt_bagit';
    public static EXPORT_NDK_PSP_BAGIT = 'ndk_psp_bagit';
    public static EXPORT_CEJSH = 'cejsh';
    public static EXPORT_CROSSREF = 'crossref';
    public static EXPORT_KWIS = 'kwis';

    public static chronicleIdentifierTypes = [ 'signature1', 'signature2', 'inventaryNumber', 'OtherNumber' , 'id', 'localId', 'officialNumber'];

    public static isChronicle(model: string): boolean {
      return model === 'model:chroniclevolume' || model === 'model:chronicletitle' || model === 'model:chroniclesupplement';
    }

}
