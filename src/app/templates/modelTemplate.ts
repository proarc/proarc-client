import { NdkMonographVolumeAacrTemplate } from "./ndkmonographvolume.aacr.template";
import { NdkMonographVolumeRdaTemplate } from "./ndkMonographvolume.rda.template";
import { NdkPeriodicalAacrTemplate } from "./ndkPeriodical.aacr.template";

export class ModelTemplate {

  static data = {
    "aacr": {
      "model:ndkmonographvolume": NdkMonographVolumeAacrTemplate.data,
      "model:ndkperiodical": NdkPeriodicalAacrTemplate
    },
    "rda": {
      "model:ndkmonographvolume": NdkMonographVolumeRdaTemplate.data,
      "model:ndkperiodical": NdkPeriodicalAacrTemplate
    },
    "model:ndkperiodicalvolume": NdkMonographVolumeAacrTemplate.data,
    "model:ndkperiodicalissue": NdkMonographVolumeAacrTemplate.data,
    "model:ndkperiodicalsupplement": NdkMonographVolumeAacrTemplate.data,
    "model:ndkarticle": NdkMonographVolumeAacrTemplate.data,
    "model:ndkpicture": NdkMonographVolumeAacrTemplate.data,
    "model:ndkmonographtitle": NdkMonographVolumeAacrTemplate.data,
    "model:ndkmonographsupplement": NdkMonographVolumeAacrTemplate.data,
    "model:ndkchapter": NdkMonographVolumeAacrTemplate.data,
    "model:ndkmap": NdkMonographVolumeAacrTemplate.data,
    "model:ndksheetmusic": NdkMonographVolumeAacrTemplate.data,
    "model:ndkpage": NdkMonographVolumeAacrTemplate.data,
    "model:page": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintomnibusvolume": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintmonographtitle": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintvolume": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintsupplement": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintchapter": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintgraphics": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintmap": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintsheetmusic": NdkMonographVolumeAacrTemplate.data,
    "model:oldprintpage": NdkMonographVolumeAacrTemplate.data,
    "model:ndkeperiodical": NdkMonographVolumeAacrTemplate.data,
    "model:ndkeperiodicalvolume": NdkMonographVolumeAacrTemplate.data,
    "model:ndkeperiodicalissue": NdkMonographVolumeAacrTemplate.data,
    "model:ndkearticle": NdkMonographVolumeAacrTemplate.data,
    "model:ndkemonographtitle": NdkMonographVolumeAacrTemplate.data,
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