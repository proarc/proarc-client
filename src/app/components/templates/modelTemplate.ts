import { NdkMonographVolumeTemplate } from "./ndkmonographvolume.template";
import { NdkPeriodicalTemplate } from "./ndkperiodical.template";

export class ModelTemplate {

  static data = {
    "model:ndkperiodical": NdkPeriodicalTemplate.data,
    "model:ndkmonographvolume": NdkMonographVolumeTemplate.data,
    "model:ndkmonographtitle": NdkMonographVolumeTemplate.data,
    "model:ndkperiodicalsupplement": NdkMonographVolumeTemplate.data,
    "model:ndkmonographsupplement": NdkMonographVolumeTemplate.data,
    "model:ndkarticle": NdkMonographVolumeTemplate.data,
    "model:ndkpicture": NdkMonographVolumeTemplate.data,
    "model:ndkchapter": NdkMonographVolumeTemplate.data,
    "model:ndkmap": NdkMonographVolumeTemplate.data,
    "model:ndksheetmusic": NdkMonographVolumeTemplate.data,
    "model:oldprintomnibusvolume": NdkMonographVolumeTemplate.data,
    "model:oldprintmonographtitle": NdkMonographVolumeTemplate.data,
    "model:oldprintvolume": NdkMonographVolumeTemplate.data,
    "model:oldprintsupplement": NdkMonographVolumeTemplate.data,
    "model:oldprintchapter": NdkMonographVolumeTemplate.data,
    "model:oldprintgraphics": NdkMonographVolumeTemplate.data,
    "model:oldprintmap": NdkMonographVolumeTemplate.data,
    "model:oldprintsheetmusic": NdkMonographVolumeTemplate.data,
    "model:ndkphonographcylinder": NdkMonographVolumeTemplate.data,
    "model:ndkmusicdocument": NdkMonographVolumeTemplate.data,
    "model:ndksong": NdkMonographVolumeTemplate.data,
    "model:ndktrack": NdkMonographVolumeTemplate.data
  }

  private static relations = {
    'ndkperiodical': ['ndkperiodicalvolume'],
    'ndkperiodicalvolume': ['ndkperiodicalissue', 'ndkperiodicalsupplement', 'ndkarticle', 'ndkchapter', 'ndkpage'],
    'ndkperiodicalissue': ['ndkpage', 'ndkperiodicalsupplement', 'ndkarticle', 'ndkchapter'],
    'ndkmonographtitle': ['ndkmonographvolume'],
    'ndkmonographvolume': ['ndkpage', 'ndkmonographsupplement', 'ndkchapter', 'ndkpicture', 'ndkpage'],
    'ndkperiodicalsupplement': ['ndkpage'],
    'ndkmonographsupplement': ['ndkpage'],
    'ndkarticle': ['ndkpage'],
    'ndkpicture': ['ndkpage'],
    'ndkchapter': ['ndkpage'],
    'ndkmap': ['ndkpage'],
    'ndksheetmusic': ['ndkpage'],
    'oldprintomnibusvolume': ['oldprintvolume', 'oldprintmonographtitle', 'oldprintgraphics', 'oldprintmap', 'oldprintsheetmusic', 'oldprintpage'],
    'oldprintmonographtitle': ['oldprintvolume'],
    'oldprintvolume': ['oldprintpage', 'oldprintchapter', 'oldprintsupplement'],
    'oldprintsupplement': ['oldprintpage'],
    'oldprintchapter': ['oldprintpage'],
    'oldprintgraphics': ['oldprintpage'],
    'oldprintmap': ['oldprintpage'],
    'oldprintsheetmusic': ['oldprintpage'],
    'ndkphonographcylinder': ['ndksong', 'ndkaudiopage'],
    'ndkmusicdocument': ['ndksndksongong', 'ndkaudiopage', 'page'],
    'ndksong': ['ndkaudiopage', 'ndktrack'],
    'ndktrack': ['ndkaudiopage'],
    'chronicletitle': ['chroniclevolume'],
    'chroniclevolume': ['page', 'chroniclesupplement'],
    'chroniclesupplement': ['page'],
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