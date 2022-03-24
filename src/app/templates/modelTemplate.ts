import { NdkMapAacrTemplate } from "./ndkMap.aacr.template";
import { NdkMapRdaTemplate } from "./ndkMap.rda.template";
import { NdkMonographSupplementAacrTemplate } from "./ndkMonographsupplement.aacr.template";
import { NdkMonographSupplementRdaTemplate } from "./ndkMonographsupplement.rda.template";
import { NdkMonographTitleAacrTemplate } from "./ndkMonographtitle.aacr.template";
import { NdkMonographTitleRdaTemplate } from "./ndkMonographtitle.rda.template";
import { NdkMonographVolumeAacrTemplate } from "./aacr/ndkMonographvolume.aacr.template";
import { NdkMonographVolumeRdaTemplate } from "./rda/ndkMonographvolume.rda.template";
import { NdkPeriodicalAacrTemplate } from "./ndkPeriodical.aacr.template";
import { NdkPeriodicalRdaTemplate } from "./ndkPeriodical.rda.template";
import { NdkPeriodicalIssueAacrTemplate } from "./ndkPeriodicalIssue.aacr.template";
import { NdkPeriodicalIssueRdaTemplate } from "./ndkPeriodicalIssue.rda.template";
import { NdkPeriodicalSupplementAacrTemplate } from "./ndkPeriodicalsupplement.aacr.template";
import { NdkPeriodicalSupplementRdaTemplate } from "./ndkPeriodicalsupplement.rda.template";
import { NdkPeriodicalVolumeAacrTemplate } from "./ndkPeriodicalVolume.aacr.template";
import { NdkPeriodicalVolumeRdaTemplate } from "./ndkPeriodicalVolume.rda.template";
import { NdkSheetMusicAacrTemplate } from "./ndkSheetmusic.aacr.template";
import { NdkSheetMusicRdaTemplate } from "./ndkSheetmusic.rda.template";
import {BdmArticleRdaTemplate} from './bdmArticle.rda.template';
import {NdkMusicDocumentAacrTemplate} from './aacr/ndkMusicDocument.aacr.template';
import {NdkMusicSongAacrTemplate} from './aacr/ndkMusicSong.aacr.template';
import {NdkMusicTrackAacrTemplate} from './aacr/ndkMusicTrack.aacr.template';
import {NdkMusicAudioPageAacrTemplate} from './aacr/ndkMusicAudioPage.aacr.template';

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

      "model:ndkarticle": NdkMonographVolumeAacrTemplate.data,
      "model:ndkpicture": NdkMonographVolumeAacrTemplate.data,
      "model:ndkchapter": NdkMonographVolumeAacrTemplate.data,

      "model:oldprintomnibusvolume": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintmonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:oldprintvolume": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintsupplement": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintchapter": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintgraphics": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintmap": NdkMonographVolumeAacrTemplate.data,
      "model:oldprintsheetmusic": NdkMonographVolumeAacrTemplate.data,

      "model:ndkeperiodical": NdkPeriodicalAacrTemplate.data,
      "model:ndkeperiodicalvolume": NdkPeriodicalVolumeAacrTemplate.data,
      "model:ndkeperiodicalissue": NdkPeriodicalIssueAacrTemplate.data,
      "model:ndkearticle": NdkMonographVolumeAacrTemplate.data,
      "model:ndkemonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:ndkemonographvolume": NdkMonographVolumeAacrTemplate.data,
      "model:ndkechapter": NdkMonographVolumeAacrTemplate.data,

      // eClanek
      "model:bdmarticle": NdkMonographVolumeAacrTemplate.data,

      // chronicle
      "model:chronicletitle": NdkMonographVolumeAacrTemplate.data,
      "model:chroniclevolume": NdkMonographVolumeAacrTemplate.data,
      "model:chroniclesupplement": NdkMonographVolumeAacrTemplate.data,

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

      "model:ndkarticle": NdkMonographVolumeRdaTemplate.data,
      "model:ndkpicture": NdkMonographVolumeRdaTemplate.data,
      "model:ndkchapter": NdkMonographVolumeRdaTemplate.data,

      "model:oldprintomnibusvolume": NdkMonographVolumeRdaTemplate.data,
      "model:oldprintmonographtitle": NdkMonographTitleRdaTemplate.data,
      "model:oldprintvolume": NdkMonographVolumeRdaTemplate.data,
      "model:oldprintsupplement": NdkMonographVolumeRdaTemplate.data,
      "model:oldprintchapter": NdkMonographVolumeRdaTemplate.data,
      "model:oldprintgraphics": NdkMonographVolumeRdaTemplate.data,
      "model:oldprintmap": NdkMonographVolumeRdaTemplate.data,
      "model:oldprintsheetmusic": NdkMonographVolumeRdaTemplate.data,

      "model:ndkeperiodical": NdkMonographVolumeRdaTemplate.data,
      "model:ndkeperiodicalvolume": NdkMonographVolumeRdaTemplate.data,
      "model:ndkeperiodicalissue": NdkMonographVolumeRdaTemplate.data,
      "model:ndkearticle": NdkMonographVolumeRdaTemplate.data,
      "model:ndkemonographtitle": NdkMonographVolumeRdaTemplate.data,
      "model:ndkemonographvolume": NdkMonographVolumeRdaTemplate.data,
      "model:ndkechapter": NdkMonographVolumeRdaTemplate.data,

      // eClanek
      "model:bdmarticle": BdmArticleRdaTemplate.data,

      // chronicle
      "model:chronicletitle": NdkMonographVolumeAacrTemplate.data,
      "model:chroniclevolume": NdkMonographVolumeAacrTemplate.data,
      "model:chroniclesupplement": NdkMonographVolumeAacrTemplate.data,

      // ndk music documents
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
