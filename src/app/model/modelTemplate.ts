
export class ModelTemplate {

  static mappings: any = {
    "aacr": {
      "model:ndkmonographtitle": 'NdkMonographTitle',
      "model:ndkmonographvolume": 'NdkMonographVolume',
      "model:ndkmonographsupplement": 'NdkMonographSupplement',
      "model:ndkmonographunit": 'NdkMonographUnit',
      "model:ndkmap": 'NdkMap',
      "model:ndkgraphic": 'NdkGraphic',
      "model:ndksheetmusic": 'NdkSheetMusic',
      "model:ndkperiodical": 'NdkPeriodical',
      "model:ndkperiodicalvolume": 'NdkPeriodicalVolume',
      "model:ndkperiodicalissue": 'NdkPeriodicalIssue',
      "model:ndkperiodicalsupplement": 'NdkPeriodicalSupplement',

      "model:ndkarticle": 'NdkArticle',
      "model:ndkpicture": 'NdkPicture',
      "model:ndkchapter": 'NdkChapter',

      "model:ndkclippingcollection": 'NdkClippingCollection',
      "model:ndkclippingdirectory": 'NdkClippingDirectory',
      "model:ndkclippingunit": 'NdkClippingUnit',

      "model:oldprintomnibusvolume": 'OldprintConvolutte',           // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:oldprintmonographtitle": 'OldprintMonographTitle',
      "model:oldprintmonographunit": 'OldprintMonographUnit',
      "model:oldprintvolume": 'OldprintMonographVolume',
      "model:oldprintsupplement": 'OldprintMonographSupplement',
      "model:oldprintchapter": 'OldprintChapter',
      "model:oldprintgraphics": 'OldprintGraphics',
      "model:oldprintmap": 'OldprintMap',
      "model:oldprintsheetmusic": 'OldprintSheetMusic',

      "model:ndkeperiodical": 'NdkePeriodical',
      "model:ndkeperiodicalvolume": 'NdkePeriodicalVolume',
      "model:ndkeperiodicalissue": 'NdkePeriodicalIssue',
      "model:ndkeperiodicalsupplement": 'NdkePeriodicalSupplement',
      "model:ndkearticle": 'NdkeArticle',
      "model:ndkemonographtitle": 'NdkeMonographTitle',
      "model:ndkemonographvolume": 'NdkeMonographVolume',
      "model:ndkemonographunit": 'NdkeMonographUnit',
      "model:ndkemonographsupplement": 'NdkeMonographSupplement',
      "model:ndkechapter": 'NdkeChapter',

      // eClanek
      "model:bdmarticle": 'BdmArticle',  // bez urceni pravidel

      // chronicle
      "model:chronicletitle": 'ChronicleMonographTitle',
      "model:chroniclevolume": 'ChronicleMonographVolume',
      "model:chroniclesupplement": 'ChronicleMonographsupplement',

      // ndk music documents
      "model:ndkphonographcylinder": 'NdkMusicPhonograph',
      "model:ndkmusicdocument": 'NdkMusicDocument',
      "model:ndksong": 'NdkMusicSong',
      "model:ndktrack": 'NdkMusicTrack',
      "model:ndkaudiopage": 'NdkMusicAudioPage',

    },
    "rda": {
      "model:ndkmonographtitle": 'NdkMonographTitle',
      "model:ndkmonographvolume": 'NdkMonographVolume',
      "model:ndkmonographsupplement": 'NdkMonographSupplement',
      "model:ndkmonographunit": 'NdkMonographUnit',
      "model:ndkmap": 'NdkMap',
      "model:ndkgraphic": 'NdkGraphic',
      "model:ndksheetmusic": 'NdkSheetMusic',
      "model:ndkperiodical": 'NdkPeriodical',
      "model:ndkperiodicalvolume": 'NdkPeriodicalVolume',
      "model:ndkperiodicalissue": 'NdkPeriodicalIssue',
      "model:ndkperiodicalsupplement": 'NdkPeriodicalSupplement',

      "model:ndkarticle": 'NdkArticle',
      "model:ndkpicture": 'NdkPicture',
      "model:ndkchapter": 'NdkChapter',

      "model:ndkclippingcollection": 'NdkClippingCollection',
      "model:ndkclippingdirectory": 'NdkClippingDirectory',
      "model:ndkclippingunit": 'NdkClippingUnit',

      "model:oldprintomnibusvolume": 'OldprintConvolutte',
      "model:oldprintmonographtitle": 'OldprintMonographTitle',
      "model:oldprintmonographunit": 'OldprintMonographUnit',
      "model:oldprintvolume": 'OldprintMonographVolume',
      "model:oldprintsupplement": 'OldprintMonographSupplement',
      "model:oldprintchapter": 'OldprintChapter',
      "model:oldprintgraphics": 'OldprintGraphics',
      "model:oldprintmap": 'OldprintMap',
      "model:oldprintsheetmusic": 'OldprintSheetMusic',

      "model:ndkeperiodical": 'NdkePeriodical',
      "model:ndkeperiodicalvolume": 'NdkePeriodicalVolume',
      "model:ndkeperiodicalissue": 'NdkePeriodicalIssue',
      "model:ndkeperiodicalsupplement": 'NdkePeriodicalSupplement',
      "model:ndkearticle": 'NdkeArticle',
      "model:ndkemonographtitle": 'NdkeMonographTitle',
      "model:ndkemonographvolume": 'NdkeMonographVolume',
      "model:ndkemonographunit": 'NdkeMonographUnit',
      "model:ndkemonographsupplement": 'NdkeMonographSupplement',
      "model:ndkechapter": 'NdkeChapter',

      // eClanek
      "model:bdmarticle": 'BdmArticle',  // bez urceni pravidel

      // chronicle
      "model:chronicletitle": 'ChronicleMonographTitle',
      "model:chroniclevolume": 'ChronicleMonographVolume',
      "model:chroniclesupplement": 'ChronicleMonographSupplement',

      // ndk music documents -- ndkMusic ma pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:ndkphonographcylinder": 'NdkMusicPhonograph',
      "model:ndkmusicdocument": 'NdkMusicDocument',
      "model:ndksong": 'NdkMusicSong',
      "model:ndktrack": 'NdkMusicTrack',
      "model:ndkaudiopage": 'NdkMusicAudioPage',

    }
  }

  private static relations: any = {
    'ndkperiodical': ['ndkperiodicalvolume'],
    'ndkperiodicalvolume': ['ndkperiodicalissue', 'ndkperiodicalsupplement'],
    'ndkperiodicalissue': ['ndkperiodicalsupplement', 'ndkarticle', 'ndkpicture', 'ndkmap', 'ndksheetmusic', 'ndkpage', 'page', 'bdmarticle'],
    'ndkperiodicalsupplement': ['ndkarticle', 'ndkpage', 'page', 'bdmarticle'],
    'ndkarticle': [],
    'ndkpicture': [],
    'ndkmonographtitle': ['ndkmonographunit'],
    'ndkmonographunit': ['ndkmonographsupplement', 'ndkchapter', 'ndkpicture', 'ndkmap', 'ndksheetmusic', 'ndkpage', 'page'],
    'ndkmonographvolume': ['ndkmonographsupplement', 'ndkchapter', 'ndkpicture', 'ndkmap', 'ndksheetmusic', 'ndkpage', 'page'],
    'ndkmonographsupplement': ['ndkchapter', 'ndkpage', 'page'],
    'ndkchapter': [],
    'ndkmap': ['ndkpage', 'page'],
    'ndkgraphic': ['ndkpage', 'page'],
    'ndksheetmusic': ['ndkpage', 'page'],
    'ndkpage': [],
    'page': [],
    'ndkclippingcollection': ['ndkclippingdirectory', 'ndkclippingunit'],
    'ndkclippingdirectory': ['ndkclippingunit'],
    'ndkclippingunit': ['ndkpage'],
    'oldprintomnibusvolume': ['oldprintvolume', 'oldprintmonographtitle', 'oldprintgraphics', 'oldprintmap', 'oldprintsheetmusic', 'oldprintpage'],
    'oldprintmonographtitle': ['oldprintmonographunit'],
    'oldprintmonographunit': ['oldprintchapter', 'oldprintsupplement', 'oldprintpage'],
    'oldprintvolume': ['oldprintchapter', 'oldprintsupplement', 'oldprintpage'],
    'oldprintsupplement': ['oldprintpage'],
    'oldprintchapter': [],
    'oldprintgraphics': ['oldprintpage'],
    'oldprintmap': ['oldprintpage'],
    'oldprintsheetmusic': ['oldprintpage'],
    'oldprintpage': [],
    'ndkeperiodical': ['ndkeperiodicalvolume'],
    'ndkeperiodicalvolume': ['ndkeperiodicalissue', 'ndkeperiodicalsupplement'],
    'ndkeperiodicalissue': ['ndkeperiodicalsupplement', 'ndkearticle'],
    'ndkeperiodicalsupplement': ['ndkearticle'],
    'ndkearticle': [],
    'ndkemonographtitle': ['ndkemonographunit'], // 'ndkechapter' odstraneno podle #99
    'ndkemonographunit': ['ndkechapter', 'ndkemonographsupplement'],
    'ndkemonographvolume': ['ndkechapter', 'ndkemonographsupplement'],
    'ndkemonographsupplement': ['ndkechapter'],
    'ndkechapter': [],
    'ndkphonographcylinder': ['ndksong', 'page'],
    'ndkmusicdocument': ['ndksong', 'page'],
    'ndksong': ['ndktrack', 'ndkaudiopage', 'page'],
    'ndktrack': ['ndkaudiopage', 'page'],
    'ndkaudiopage': [],
    'chronicletitle': ['chroniclevolume', 'chronicletitle'],
    'chroniclevolume': ['chroniclesupplement', 'page'],
    'chroniclesupplement': ['page'],
    'bdmarticle': []
  }

  static allowedChildrenForModel(configModels: string[], model: string) {
    if (model.startsWith('model:')) {
      model = model.substring(6);
    }
    let models: string[] = ModelTemplate.relations[model];
    if (!models) {
      return [];
    }
    // return models.map((m: string) => `model:${m}`);

    models = models.map((m: string) => `model:${m}`);
    return configModels.filter(m => models.includes(m)) ;
  }

  static allowedParentsForModel(model: string) {
    if (model.startsWith('model:')) {
      model = model.substring(6);
    }
    const models: string[] = [];
    const keys = Object.keys(ModelTemplate.relations);
    keys.forEach(k => {
      if (ModelTemplate.relations[k].includes(model)) {
        models.push('model:'+ k);
      }
    });
    return models;
  }


}
