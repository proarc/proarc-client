

export class ProArc {

    public static EXPORT_DATASTREAM_FULL = 'datastream_full';
    public static EXPORT_DATASTREAM_RAW = 'datastream_raw';
    public static EXPORT_DATASTREAM_NDKUSER = 'datastream_ndkUser';
    public static EXPORT_KRAMERIUS = 'kramerius';
    public static EXPORT_KRAMERIUS_BAGIT = 'kramerius_bagit';
    public static EXPORT_ARCHIVE = 'archive';
    public static EXPORT_ARCHIVE_OLDPRINT = 'archive_stt';
    public static EXPORT_NDK_PSP = 'ndk_psp';
    public static EXPORT_NDK_PSP_BAGIT = 'ndk_psp_bagit';
    public static EXPORT_NDK_PSP_CESNET_UPLOAD = 'ndk_psp_upload_cesnet';
    public static EXPORT_NDK_KRAMERIUS_UPLOAD = 'ndk_psp_upload_kramerius';
    public static EXPORT_NDK_SIP = 'ndk_sip';
    public static EXPORT_NDK_SIP_BAGIT = 'ndk_sip_bagit';
    public static EXPORT_NDK_OLDPRINT = 'ndk_oldprint';
    public static EXPORT_NDK_OLDPRINT_BAGIT = 'ndk_oldprint_bagit';
    public static EXPORT_NDK_OLDPRINT_CESNET_UPLOAD = 'ndk_oldprint_upload_cesnet';
    public static EXPORT_NDK_OLDPRINT_KRAMERIUS_UPLOAD = 'ndk_oldprint_upload_kramerius';
    public static EXPORT_ARCHIVE_BAGIT = 'archive_bagit';
    public static EXPORT_ARCHIVE_OLDPRINT_BAGIT = 'archive_stt_bagit';
    public static EXPORT_CEJSH = 'cejsh';
    public static EXPORT_CROSSREF = 'crossref';
    public static EXPORT_KWIS = 'kwis';
    public static EXPORT_ARCHIVE_EXTENDED = 'archive_extended';
    public static EXPORT_ARCHIVE_STT_EXTENDED = 'archive_stt_extended';
    public static EXPORT_ARCHIVE_EXTENDED_BAGIT = 'archive_extended_bagit';
    public static EXPORT_ARCHIVE_STT_EXTENDED_BAGIT = 'archive_stt_extended_bagit';
    

    public static chronicleIdentifierTypes = [ 'signature1', 'signature2', 'inventaryNumber', 'OtherNumber' , 'id', 'localId', 'officialNumber'];

    public static isChronicle(model: string): boolean {
      return model === 'model:chroniclevolume' || model === 'model:chronicletitle' || model === 'model:chroniclesupplement';
    }

}
