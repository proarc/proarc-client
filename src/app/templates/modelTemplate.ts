// import { NdkMap } from "./aacr/ndkMap.aacr.template";
// import { NdkMap } from "./rda/ndkMap.rda.template";
// import { NdkMonographSupplement } from "./aacr/ndkMonographsupplement.aacr.template";
// import { NdkMonographSupplement } from "./rda/ndkMonographsupplement.rda.template";
// import { NdkMonographTitle } from "./aacr/ndkMonographtitle.aacr.template";
// import { NdkMonographTitle } from "./rda/ndkMonographtitle.rda.template";
// import { NdkMonographVolume } from "./aacr/ndkMonographvolume.aacr.template";
// import { NdkMonographVolume } from "./rda/ndkMonographvolume.rda.template";
// import { NdkPeriodical } from "./aacr/ndkPeriodical.aacr.template";
// import { NdkPeriodical } from "./rda/ndkPeriodical.rda.template";
// import { NdkPeriodicalIssue } from "./aacr/ndkPeriodicalIssue.aacr.template";
// import { NdkPeriodicalIssue } from "./rda/ndkPeriodicalIssue.rda.template";
// import { NdkPeriodicalSupplement } from "./aacr/ndkPeriodicalsupplement.aacr.template";
// import { NdkPeriodicalSupplement } from "./rda/ndkPeriodicalsupplement.rda.template";
// import { NdkPeriodicalVolume } from "./aacr/ndkPeriodicalVolume.aacr.template";
// import { NdkPeriodicalVolume } from "./rda/ndkPeriodicalVolume.rda.template";
// import { NdkSheetMusic } from "./aacr/ndkSheetmusic.aacr.template";
// import { NdkSheetMusic } from "./rda/ndkSheetmusic.rda.template";
// import {NdkMusicDocument} from './aacr/ndkMusicDocument.aacr.template';
// import {NdkMusicSong} from './aacr/ndkMusicSong.aacr.template';
// import {NdkMusicTrack} from './aacr/ndkMusicTrack.aacr.template';
// import {NdkMusicAudioPage} from './aacr/ndkMusicAudioPage.aacr.template';
// import {} from './aacr/aacr.template';
// import {} from './rda/rda.template';
// import {NdkPicture} from './aacr/ndkPicture.aacr.template';
// import {NdkChapter} from './aacr/ndkChapter.aacr.template';
// import {NdkArticle} from './aacr/ndkArticle.aacr.template';
// import {NdkArticle} from './rda/ndkArticle.rda.template';
// import {BdmArticleTemplate} from './none/bdmArticle.template';
// import {OldprintConvolutte} from './aacr/oldprintConvolutte.aacr.template';
// import {OldprintMonographtitle} from './aacr/oldprintMonographtitle.aacr.template';
// import {OldprintMonographtitle} from './rda/oldprintMonographtitle.rda.template';
// import {OldprintMonographVolume} from './aacr/oldprintMonographvolume.aacr.template';
// import {OldprintMonographVolume} from './rda/oldprintMonographvolume.rda.template';
// import {OldprintMonographSupplement} from './rda/oldprintMonographsupplement.rda.template';
// import {OldprintMonographSupplement} from './aacr/oldprintMonographsupplement.aacr.template';
// import {OldprintChapter} from './aacr/oldprintChapter.aacr.template';
// import {OldprintChapter} from './rda/oldprintChapter.rda.template';
// import {OldprintGraphics} from './rda/oldprintGraphics.rda.template';
// import {OldprintGraphics} from './aacr/oldprintGraphics.aacr.template';
// import {OldprintMap} from './rda/oldprintMap.rda.template';
// import {OldprintMap} from './aacr/oldprintMap.aacr.template';
// import {OldprintSheetMusic} from './rda/oldprintSheetmusic.rda.template';
// import {OldprintSheetMusic} from './aacr/oldprintSheetmusic.aacr.template';
// import {NdkePeriodical} from './rda/ndkePeriodical.rda.template';
// import {NdkePeriodical} from './aacr/ndkePeriodical.aacr.template';
// import {NdkePeriodicalVolume} from './rda/ndkePeriodicalVolume.rda.template';
// import {NdkePeriodicalVolume} from './aacr/ndkePeriodicalVolume.aacr.template';
// import {NdkePeriodicalIssue} from './rda/ndkePeriodicalIssue.rda.template';
// import {NdkePeriodicalIssue} from './aacr/ndkePeriodicalIssue.aacr.template';
// import {NdkeArticle} from './rda/ndkeArticle.rda.template';
// import {NdkeArticle} from './aacr/ndkeArticle.aacr.template';
// import {NdkeMonographTitle} from './rda/ndkeMonographtitle.rda.template';
// import {NdkeMonographTitle} from './aacr/ndkeMonographtitle.aacr.template';
// import {NdkeMonographVolume} from './rda/ndkeMonographvolume.rda.template';
// import {NdkeMonographVolume} from './aacr/ndkeMonographvolume.aacr.template';
// import {NdkeChapter} from './rda/ndkeChapter.rda.template';
// import {NdkeChapter} from './aacr/ndkeChapter.aacr.template';
// import {ChronicleMonographtitle} from './aacr/chronicleMonographtitle.aacr.template';
// import {ChronicleMonographvolume} from './aacr/chronicleMonographvolume.aacr.template';
// import {ChronicleMonographsupplement} from './aacr/chronicleMonographsupplement.aacr.template';

export class ModelTemplate {

  static mappings: any = {
    "aacr": {
      "model:ndkmonographtitle": 'NdkMonographTitle',
      "model:ndkmonographvolume": 'NdkMonographVolume',
      "model:ndkmonographsupplement": 'NdkMonographSupplement',
      "model:ndkmap": 'NdkMap',
      "model:ndksheetmusic": 'NdkSheetMusic',
      "model:ndkperiodical": 'NdkPeriodical',
      "model:ndkperiodicalvolume": 'NdkPeriodicalVolume',
      "model:ndkperiodicalissue": 'NdkPeriodicalIssue',
      "model:ndkperiodicalsupplement": 'NdkPeriodicalSupplement',

      "model:ndkarticle": 'NdkArticle',
      "model:ndkpicture": 'NdkPicture',
      "model:ndkchapter": 'NdkChapter',

      "model:oldprintomnibusvolume": 'OldprintConvolutte',           // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:oldprintmonographtitle": 'OldprintMonographtitle',
      "model:oldprintvolume": 'OldprintMonographVolume',
      "model:oldprintsupplement": 'OldprintMonographSupplement',
      "model:oldprintchapter": 'OldprintChapter',
      "model:oldprintgraphics": 'OldprintGraphics',
      "model:oldprintmap": 'OldprintMap',
      "model:oldprintsheetmusic": 'OldprintSheetMusic',

      "model:ndkeperiodical": 'NdkePeriodical',
      "model:ndkeperiodicalvolume": 'NdkePeriodicalVolume',
      "model:ndkeperiodicalissue": 'NdkePeriodicalIssue',
      "model:ndkearticle": 'NdkeArticle',
      "model:ndkemonographtitle": 'NdkeMonographTitle',
      "model:ndkemonographvolume": 'NdkeMonographVolume',
      "model:ndkechapter": 'NdkeChapter',

      // eClanek
      "model:bdmarticle": 'BdmArticleTemplate',  // bez urceni pravidel

      // chronicle
      "model:chronicletitle": 'ChronicleMonographtitle',
      "model:chroniclevolume": 'ChronicleMonographvolume',
      "model:chroniclesupplement": 'ChronicleMonographsupplement',

      // ndk music documents
      "model:ndkphonographcylinder": 'NdkMusicDocument',
      "model:ndkmusicdocument": 'NdkMusicDocument',
      "model:ndksong": 'NdkMusicSong',
      "model:ndktrack": 'NdkMusicTrack',
      "model:ndkaudiopage": 'NdkMusicAudioPage',

    },
    "rda": {
      "model:ndkmonographtitle": 'NdkMonographTitle',
      "model:ndkmonographvolume": 'NdkMonographVolume',
      "model:ndkmonographsupplement": 'NdkMonographSupplement',
      "model:ndkmap": 'NdkMap',
      "model:ndksheetmusic": 'NdkSheetMusic',
      "model:ndkperiodical": 'NdkPeriodical',
      "model:ndkperiodicalvolume": 'NdkPeriodicalVolume',
      "model:ndkperiodicalissue": 'NdkPeriodicalIssue',
      "model:ndkperiodicalsupplement": 'NdkPeriodicalSupplement',

      "model:ndkarticle": 'NdkArticle',
      "model:ndkpicture": 'NdkPicture', // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:ndkchapter": 'NdkChapter', // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda

      "model:oldprintomnibusvolume": 'OldprintConvolutte',       // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:oldprintmonographtitle": 'OldprintMonographtitle',
      "model:oldprintvolume": 'OldprintMonographVolume',
      "model:oldprintsupplement": 'OldprintMonographSupplement',
      "model:oldprintchapter": 'OldprintChapter',
      "model:oldprintgraphics": 'OldprintGraphics',
      "model:oldprintmap": 'OldprintMap',
      "model:oldprintsheetmusic": 'OldprintSheetMusic',

      "model:ndkeperiodical": 'NdkePeriodical',
      "model:ndkeperiodicalvolume": 'NdkePeriodicalVolume',
      "model:ndkeperiodicalissue": 'NdkePeriodicalIssue',
      "model:ndkearticle": 'NdkeArticle',
      "model:ndkemonographtitle": 'NdkeMonographTitle',
      "model:ndkemonographvolume": 'NdkeMonographVolume',
      "model:ndkechapter": 'NdkeChapter', // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda

      // eClanek
      "model:bdmarticle": 'BdmArticleTemplate',  // bez urceni pravidel

      // chronicle
      "model:chronicletitle": 'ChronicleMonographtitle',
      "model:chroniclevolume": 'ChronicleMonographvolume',
      "model:chroniclesupplement": 'ChronicleMonographsupplement',

      // ndk music documents -- ndkMusic ma pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:ndkphonographcylinder": 'NdkMusicDocument',
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
    'ndkperiodicalsupplement': ['ndkpage', 'page'],
    'ndkarticle': [],
    'ndkpicture': [],
    'ndkmonographtitle': ['ndkmonographvolume', 'ndkmonographtitle'],
    'ndkmonographvolume': ['ndkmonographsupplement', 'ndkchapter', 'ndkpicture', 'ndkmap', 'ndksheetmusic', 'ndkpage', 'page'],
    'ndkmonographsupplement': ['ndkpage', 'page'],
    'ndkchapter': [],
    'ndkmap': ['ndkpage', 'page'],
    'ndksheetmusic': ['ndkpage', 'page'],
    'ndkpage': [],
    'page': [],
    'oldprintomnibusvolume': ['oldprintvolume', 'oldprintmonographtitle', 'oldprintgraphics', 'oldprintmap', 'oldprintsheetmusic', 'oldprintpage'],
    'oldprintmonographtitle': ['oldprintvolume'],
    'oldprintvolume': ['oldprintchapter', 'oldprintsupplement', 'oldprintpage'],
    'oldprintsupplement': ['oldprintpage'],
    'oldprintchapter': [],
    'oldprintgraphics': ['oldprintpage'],
    'oldprintmap': ['oldprintpage'],
    'oldprintsheetmusic': ['oldprintpage'],
    'oldprintpage': [],
    'ndkeperiodical': ['ndkeperiodicalvolume'],
    'ndkeperiodicalvolume': ['ndkeperiodicalissue'],
    'ndkeperiodicalissue': ['ndkearticle'],
    'ndkearticle': [],
    'ndkemonographtitle': ['ndkemonographvolume'], // 'ndkechapter' odstraneno podle #99
    'ndkemonographvolume': ['ndkechapter'],
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

  static allowedChildrenForModel(model: string) {
    if (model.startsWith('model:')) {
      model = model.substring(6);
    }
    const models: any = ModelTemplate.relations[model];
    if (!models) {
      return [];
    }
    return models.map((m: string) => `model:${m}`);
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
