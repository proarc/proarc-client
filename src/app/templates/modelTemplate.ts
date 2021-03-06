import { NdkMapAacrTemplate } from "./ndkMap.aacr.template";
import { NdkMapRdaTemplate } from "./ndkMap.rda.template";
import { NdkMonographTitleAacrTemplate } from "./ndkMonographtitle.aacr.template";
import { NdkMonographTitleRdaTemplate } from "./ndkMonographtitle.rda.template";
import { NdkMonographVolumeAacrTemplate } from "./ndkMonographvolume.aacr.template";
import { NdkMonographVolumeRdaTemplate } from "./ndkMonographvolume.rda.template";
import { NdkPeriodicalAacrTemplate } from "./ndkPeriodical.aacr.template";
import { NdkPeriodicalRdaTemplate } from "./ndkPeriodical.rda.template";
import { NdkPeriodicalIssueAacrTemplate } from "./ndkPeriodicalissue.aacr.template";
import { NdkPeriodicalSupplementAacrTemplate } from "./ndkPeriodicalsupplement.aacr.template";
import { NdkPeriodicalSupplementRdaTemplate } from "./ndkPeriodicalsupplement.rda.template";
import { NdkPeriodicalVolumeAacrTemplate } from "./ndkPeriodicalvolume.aacr.template";
import { NdkSheetMusicAacrTemplate } from "./ndkSheetmusic.aacr.template";
import { NdkSheetMusicRdaTemplate } from "./ndkSheetmusic.rda.template";

export class ModelTemplate {

  static data = {
    "aacr": {
      "model:ndkmonographtitle": NdkMonographTitleAacrTemplate.data,
      "model:ndkmonographvolume": NdkMonographVolumeAacrTemplate.data,
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

      "model:ndkphonographcylinder": NdkMonographVolumeAacrTemplate.data,
      "model:ndkmusicdocument": NdkMonographVolumeAacrTemplate.data,
      "model:ndksong": NdkMonographVolumeAacrTemplate.data,
      "model:ndktrack": NdkMonographVolumeAacrTemplate.data,
      "model:ndkaudiopage": NdkMonographVolumeAacrTemplate.data,
      "model:chronicletitle": NdkMonographVolumeAacrTemplate.data,
      "model:chroniclevolume": NdkMonographVolumeAacrTemplate.data,
      "model:chroniclesupplement": NdkMonographVolumeAacrTemplate.data,
      "model:bdmarticle": NdkMonographVolumeAacrTemplate.data

    },
    "rda": {
      "model:ndkmonographtitle": NdkMonographTitleRdaTemplate.data,
      "model:ndkmonographvolume": NdkMonographVolumeRdaTemplate.data,
      "model:ndkmap": NdkMapRdaTemplate.data,
      "model:ndksheetmusic": NdkSheetMusicRdaTemplate.data,
      "model:ndkperiodical": NdkPeriodicalRdaTemplate.data,
      "model:ndkperiodicalvolume": NdkPeriodicalVolumeAacrTemplate.data,
      "model:ndkperiodicalissue": NdkPeriodicalIssueAacrTemplate.data,
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