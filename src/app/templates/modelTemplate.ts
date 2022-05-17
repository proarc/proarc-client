import { NdkMapAacrTemplate } from "./aacr/ndkMap.aacr.template";
import { NdkMapRdaTemplate } from "./rda/ndkMap.rda.template";
import { NdkMonographSupplementAacrTemplate } from "./aacr/ndkMonographsupplement.aacr.template";
import { NdkMonographSupplementRdaTemplate } from "./rda/ndkMonographsupplement.rda.template";
import { NdkMonographTitleAacrTemplate } from "./aacr/ndkMonographtitle.aacr.template";
import { NdkMonographTitleRdaTemplate } from "./rda/ndkMonographtitle.rda.template";
import { NdkMonographVolumeAacrTemplate } from "./aacr/ndkMonographvolume.aacr.template";
import { NdkMonographVolumeRdaTemplate } from "./rda/ndkMonographvolume.rda.template";
import { NdkPeriodicalAacrTemplate } from "./aacr/ndkPeriodical.aacr.template";
import { NdkPeriodicalRdaTemplate } from "./rda/ndkPeriodical.rda.template";
import { NdkPeriodicalIssueAacrTemplate } from "./aacr/ndkPeriodicalIssue.aacr.template";
import { NdkPeriodicalIssueRdaTemplate } from "./rda/ndkPeriodicalIssue.rda.template";
import { NdkPeriodicalSupplementAacrTemplate } from "./aacr/ndkPeriodicalsupplement.aacr.template";
import { NdkPeriodicalSupplementRdaTemplate } from "./rda/ndkPeriodicalsupplement.rda.template";
import { NdkPeriodicalVolumeAacrTemplate } from "./aacr/ndkPeriodicalVolume.aacr.template";
import { NdkPeriodicalVolumeRdaTemplate } from "./rda/ndkPeriodicalVolume.rda.template";
import { NdkSheetMusicAacrTemplate } from "./aacr/ndkSheetmusic.aacr.template";
import { NdkSheetMusicRdaTemplate } from "./rda/ndkSheetmusic.rda.template";
import {NdkMusicDocumentAacrTemplate} from './aacr/ndkMusicDocument.aacr.template';
import {NdkMusicSongAacrTemplate} from './aacr/ndkMusicSong.aacr.template';
import {NdkMusicTrackAacrTemplate} from './aacr/ndkMusicTrack.aacr.template';
import {NdkMusicAudioPageAacrTemplate} from './aacr/ndkMusicAudioPage.aacr.template';
import {AacrTemplate} from './aacr/aacr.template';
import {RdaTemplate} from './rda/rda.template';
import {NdkPictureAacrTemplate} from './aacr/ndkPicture.aacr.template';
import {NdkChapterAacrTemplate} from './aacr/ndkChapter.aacr.template';
import {NdkArticleAacrTemplate} from './aacr/ndkArticle.aacr.template';
import {NdkArticleRdaTemplate} from './rda/ndkArticle.rda.template';
import {BdmArticleTemplate} from './none/bdmArticle.template';
import {OldprintConvolutteAacrTemplate} from './aacr/oldprintConvolutte.aacr.template';
import {OldprintMonographtitleAacrTemplate} from './aacr/oldprintMonographtitle.aacr.template';
import {OldprintMonographtitleRdaTemplate} from './rda/oldprintMonographtitle.rda.template';
import {OldprintMonographVolumeAacrTemplate} from './aacr/oldprintMonographvolume.aacr.template';
import {OldprintMonographVolumeRdaTemplate} from './rda/oldprintMonographvolume.rda.template';
import {OldprintMonographSupplementRdaTemplate} from './rda/oldprintMonographsupplement.rda.template';
import {OldprintMonographSupplementAacrTemplate} from './aacr/oldprintMonographsupplement.aacr.template';
import {OldprintChapterAacrTemplate} from './aacr/oldprintChapter.aacr.template';
import {OldprintChapterRdaTemplate} from './rda/oldprintChapter.rda.template';
import {OldprintGraphicsRdaTemplate} from './rda/oldprintGraphics.rda.template';
import {OldprintGraphicsAacrTemplate} from './aacr/oldprintGraphics.aacr.template';
import {OldprintMapRdaTemplate} from './rda/oldprintMap.rda.template';
import {OldprintMapAacrTemplate} from './aacr/oldprintMap.aacr.template';
import {OldprintSheetMusicRdaTemplate} from './rda/oldprintSheetmusic.rda.template';
import {OldprintSheetMusicAacrTemplate} from './aacr/oldprintSheetmusic.aacr.template';
import {NdkePeriodicalRdaTemplate} from './rda/ndkePeriodical.rda.template';
import {NdkePeriodicalAacrTemplate} from './aacr/ndkePeriodical.aacr.template';
import {NdkePeriodicalVolumeRdaTemplate} from './rda/ndkePeriodicalVolume.rda.template';
import {NdkePeriodicalVolumeAacrTemplate} from './aacr/ndkePeriodicalVolume.aacr.template';
import {NdkePeriodicalIssueRdaTemplate} from './rda/ndkePeriodicalIssue.rda.template';
import {NdkePeriodicalIssueAacrTemplate} from './aacr/ndkePeriodicalIssue.aacr.template';
import {NdkeArticleRdaTemplate} from './rda/ndkeArticle.rda.template';
import {NdkeArticleAacrTemplate} from './aacr/ndkeArticle.aacr.template';

export class ModelTemplate {

  static data = {
    "aacr": {
      "model:ndkmonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:ndkmonographvolume": NdkMonographVolumeAacrTemplate.data,
      "model:ndkmonographsupplement": NdkMonographSupplementAacrTemplate.data,
      "model:ndkmap": NdkMapAacrTemplate.data,
      "model:ndksheetmusic": NdkSheetMusicAacrTemplate.data,
      "model:ndkperiodical": NdkPeriodicalAacrTemplate.data,
      "model:ndkperiodicalvolume": NdkPeriodicalVolumeAacrTemplate.data,
      "model:ndkperiodicalissue": NdkPeriodicalIssueAacrTemplate.data,
      "model:ndkperiodicalsupplement": NdkPeriodicalSupplementAacrTemplate.data,

      "model:ndkarticle": NdkArticleAacrTemplate.data,
      "model:ndkpicture": NdkPictureAacrTemplate.data,
      "model:ndkchapter": NdkChapterAacrTemplate.data,

      "model:oldprintomnibusvolume": OldprintConvolutteAacrTemplate.data,           // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:oldprintmonographtitle": OldprintMonographtitleAacrTemplate.data,
      "model:oldprintvolume": OldprintMonographVolumeAacrTemplate.data,
      "model:oldprintsupplement": OldprintMonographSupplementAacrTemplate.data,
      "model:oldprintchapter": OldprintChapterAacrTemplate.data,
      "model:oldprintgraphics": OldprintGraphicsAacrTemplate.data,
      "model:oldprintmap": OldprintMapAacrTemplate.data,
      "model:oldprintsheetmusic": OldprintSheetMusicAacrTemplate.data,

      "model:ndkeperiodical": NdkePeriodicalAacrTemplate.data,
      "model:ndkeperiodicalvolume": NdkePeriodicalVolumeAacrTemplate.data,
      "model:ndkeperiodicalissue": NdkePeriodicalIssueAacrTemplate.data,
      "model:ndkearticle": NdkeArticleAacrTemplate.data,
      "model:ndkemonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:ndkemonographvolume": NdkMonographVolumeAacrTemplate.data,
      "model:ndkechapter": NdkChapterAacrTemplate.data,

      // eClanek
      "model:bdmarticle": BdmArticleTemplate.data,  // bez urceni pravidel

      // chronicle
      "model:chronicletitle": AacrTemplate.data,
      "model:chroniclevolume": AacrTemplate.data,
      "model:chroniclesupplement": AacrTemplate.data,

      // ndk music documents
      "model:ndkphonographcylinder": NdkMusicDocumentAacrTemplate.data,
      "model:ndkmusicdocument": NdkMusicDocumentAacrTemplate.data,
      "model:ndksong": NdkMusicSongAacrTemplate.data,
      "model:ndktrack": NdkMusicTrackAacrTemplate.data,
      "model:ndkaudiopage": NdkMusicAudioPageAacrTemplate.data,

    },
    "rda": {
      "model:ndkmonographtitle": NdkMonographTitleRdaTemplate.data,
      "model:ndkmonographvolume": NdkMonographVolumeRdaTemplate.data,
      "model:ndkmonographsupplement": NdkMonographSupplementRdaTemplate.data,
      "model:ndkmap": NdkMapRdaTemplate.data,
      "model:ndksheetmusic": NdkSheetMusicRdaTemplate.data,
      "model:ndkperiodical": NdkPeriodicalRdaTemplate.data,
      "model:ndkperiodicalvolume": NdkPeriodicalVolumeRdaTemplate.data,
      "model:ndkperiodicalissue": NdkPeriodicalIssueRdaTemplate.data,
      "model:ndkperiodicalsupplement": NdkPeriodicalSupplementRdaTemplate.data,

      "model:ndkarticle": NdkArticleRdaTemplate.data,
      "model:ndkpicture": NdkPictureAacrTemplate.data, // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:ndkchapter": NdkChapterAacrTemplate.data, // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda

      "model:oldprintomnibusvolume": OldprintConvolutteAacrTemplate.data,       // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:oldprintmonographtitle": OldprintMonographtitleRdaTemplate.data,
      "model:oldprintvolume": OldprintMonographVolumeRdaTemplate.data,
      "model:oldprintsupplement": OldprintMonographSupplementRdaTemplate.data,
      "model:oldprintchapter": OldprintChapterRdaTemplate.data,
      "model:oldprintgraphics": OldprintGraphicsRdaTemplate.data,
      "model:oldprintmap": OldprintMapRdaTemplate.data,
      "model:oldprintsheetmusic": OldprintSheetMusicRdaTemplate.data,

      "model:ndkeperiodical": NdkePeriodicalRdaTemplate.data,
      "model:ndkeperiodicalvolume": NdkePeriodicalVolumeRdaTemplate.data,
      "model:ndkeperiodicalissue": NdkePeriodicalIssueRdaTemplate.data,
      "model:ndkearticle": NdkeArticleRdaTemplate.data,
      "model:ndkemonographtitle": NdkMonographTitleRdaTemplate.data,
      "model:ndkemonographvolume": NdkMonographVolumeRdaTemplate.data,
      "model:ndkechapter": NdkChapterAacrTemplate.data, // pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda

      // eClanek
      "model:bdmarticle": BdmArticleTemplate.data,  // bez urceni pravidel

      // chronicle
      "model:chronicletitle": AacrTemplate.data,
      "model:chroniclevolume": AacrTemplate.data,
      "model:chroniclesupplement": AacrTemplate.data,

      // ndk music documents -- ndkMusic ma pouze aacr, ale abyse predeslo nullpointeru, jeto nakopirovano i do rda
      "model:ndkphonographcylinder": NdkMusicDocumentAacrTemplate.data,
      "model:ndkmusicdocument": NdkMusicDocumentAacrTemplate.data,
      "model:ndksong": NdkMusicSongAacrTemplate.data,
      "model:ndktrack": NdkMusicTrackAacrTemplate.data,
      "model:ndkaudiopage": NdkMusicAudioPageAacrTemplate.data,

    }
  }

  private static relations = {
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
    'ndkemonographtitle': ['ndkechapter', 'ndkemonographvolume'],
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
    const models = ModelTemplate.relations[model];
    if (!models) {
      return [];
    }
    return models.map((m: string) => `model:${m}`);
  }


}
