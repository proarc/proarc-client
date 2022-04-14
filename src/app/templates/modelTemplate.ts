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
import { NdkPeriodicalIssueAacrTemplate } from "./ndkPeriodicalIssue.aacr.template";
import { NdkPeriodicalIssueRdaTemplate } from "./ndkPeriodicalIssue.rda.template";
import { NdkPeriodicalSupplementAacrTemplate } from "./ndkPeriodicalsupplement.aacr.template";
import { NdkPeriodicalSupplementRdaTemplate } from "./ndkPeriodicalsupplement.rda.template";
import { NdkPeriodicalVolumeAacrTemplate } from "./aacr/ndkPeriodicalVolume.aacr.template";
import { NdkPeriodicalVolumeRdaTemplate } from "./rda/ndkPeriodicalVolume.rda.template";
import { NdkSheetMusicAacrTemplate } from "./aacr/ndkSheetmusic.aacr.template";
import { NdkSheetMusicRdaTemplate } from "./rda/ndkSheetmusic.rda.template";
import {BdmArticleRdaTemplate} from './bdmArticle.rda.template';
import {NdkMusicDocumentAacrTemplate} from './aacr/ndkMusicDocument.aacr.template';
import {NdkMusicSongAacrTemplate} from './aacr/ndkMusicSong.aacr.template';
import {NdkMusicTrackAacrTemplate} from './aacr/ndkMusicTrack.aacr.template';
import {NdkMusicAudioPageAacrTemplate} from './aacr/ndkMusicAudioPage.aacr.template';
import {AacrTemplate} from './aacr/aacr.template';
import {RdaTemplate} from './rda/rda.template';
import {NdkPictureAacrTemplate} from './aacr/NdkPicture.aacr.template';
import {NdkChapterAacrTemplate} from './aacr/NdkChapter.aacr.template';

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

      "model:ndkarticle": AacrTemplate.data,
      "model:ndkpicture": NdkPictureAacrTemplate.data,
      "model:ndkchapter": NdkChapterAacrTemplate.data,

      "model:oldprintomnibusvolume": NdkMonographTitleAacrTemplate.data,
      "model:oldprintmonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:oldprintvolume": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintsupplement": AacrTemplate.data,
      "model:oldprintchapter": NdkChapterAacrTemplate.data,
      "model:oldprintgraphics": NdkPictureAacrTemplate.data,
      "model:oldprintmap": NdkMapAacrTemplate.data,
      "model:oldprintsheetmusic": NdkSheetMusicAacrTemplate.data,

      "model:ndkeperiodical": NdkPeriodicalAacrTemplate.data,
      "model:ndkeperiodicalvolume": NdkPeriodicalVolumeAacrTemplate.data,
      "model:ndkeperiodicalissue": NdkPeriodicalIssueAacrTemplate.data,
      "model:ndkearticle": AacrTemplate.data,
      "model:ndkemonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:ndkemonographvolume": NdkMonographVolumeAacrTemplate.data,
      "model:ndkechapter": NdkChapterAacrTemplate.data,

      // eClanek
      "model:bdmarticle": AacrTemplate.data,

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

      "model:ndkarticle": RdaTemplate.data,
      "model:ndkpicture": RdaTemplate.data,
      "model:ndkchapter": RdaTemplate.data,

      "model:oldprintomnibusvolume": RdaTemplate.data,
      "model:oldprintmonographtitle": NdkMonographTitleRdaTemplate.data,
      "model:oldprintvolume": RdaTemplate.data,
      "model:oldprintsupplement": NdkMonographSupplementRdaTemplate.data,
      "model:oldprintchapter": RdaTemplate.data,
      "model:oldprintgraphics": NdkMapRdaTemplate.data,
      "model:oldprintmap": NdkMapRdaTemplate.data,
      "model:oldprintsheetmusic": NdkSheetMusicRdaTemplate.data,

      "model:ndkeperiodical": RdaTemplate.data,
      "model:ndkeperiodicalvolume": RdaTemplate.data,
      "model:ndkeperiodicalissue": RdaTemplate.data,
      "model:ndkearticle": RdaTemplate.data,
      "model:ndkemonographtitle": NdkMonographTitleRdaTemplate.data,
      "model:ndkemonographvolume": RdaTemplate.data,
      "model:ndkechapter": RdaTemplate.data,

      // eClanek
      "model:bdmarticle": BdmArticleRdaTemplate.data,

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
