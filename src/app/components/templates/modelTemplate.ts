import { NdkMonographVolumeTemplate } from "./ndkmonographvolume.template";
import { NdkMonographVolumeRdaTemplate } from "./ndkmonographvolumeRda.template";
import { NdkPeriodicalTemplate } from "./ndkperiodical.template";

export class ModelTemplate {

  static data = {
    "model:ndkperiodical": NdkPeriodicalTemplate.data,
    "model:ndkperiodicalvolume": NdkMonographVolumeTemplate.data,
    "model:ndkperiodicalissue": NdkMonographVolumeTemplate.data,
    "model:ndkperiodicalsupplement": NdkMonographVolumeTemplate.data,
    "model:ndkarticle": NdkMonographVolumeTemplate.data,
    "model:ndkpicture": NdkMonographVolumeTemplate.data,
    "model:ndkmonographtitle": NdkMonographVolumeTemplate.data,
    "model:ndkmonographvolume": {
      "aacr": NdkMonographVolumeTemplate.data,
      "rda": NdkMonographVolumeRdaTemplate.data 
    },
    "model:ndkmonographsupplement": NdkMonographVolumeTemplate.data,
    "model:ndkchapter": NdkMonographVolumeTemplate.data,
    "model:ndkmap": NdkMonographVolumeTemplate.data,
    "model:ndksheetmusic": NdkMonographVolumeTemplate.data,
    "model:ndkpage": NdkMonographVolumeTemplate.data,
    "model:page": NdkMonographVolumeTemplate.data,
    "model:oldprintomnibusvolume": NdkMonographVolumeTemplate.data,
    "model:oldprintmonographtitle": NdkMonographVolumeTemplate.data,
    "model:oldprintvolume": NdkMonographVolumeTemplate.data,
    "model:oldprintsupplement": NdkMonographVolumeTemplate.data,
    "model:oldprintchapter": NdkMonographVolumeTemplate.data,
    "model:oldprintgraphics": NdkMonographVolumeTemplate.data,
    "model:oldprintmap": NdkMonographVolumeTemplate.data,
    "model:oldprintsheetmusic": NdkMonographVolumeTemplate.data,
    "model:oldprintpage": NdkMonographVolumeTemplate.data,
    "model:ndkeperiodical": NdkMonographVolumeTemplate.data,
    "model:ndkeperiodicalvolume": NdkMonographVolumeTemplate.data,
    "model:ndkeperiodicalissue": NdkMonographVolumeTemplate.data,
    "model:ndkearticle": NdkMonographVolumeTemplate.data,
    "model:ndkemonographtitle": NdkMonographVolumeTemplate.data,
    "model:ndkemonographvolume": NdkMonographVolumeTemplate.data,
    "model:ndkechapter": NdkMonographVolumeTemplate.data,
    "model:ndkphonographcylinder": NdkMonographVolumeTemplate.data,
    "model:ndkmusicdocument": NdkMonographVolumeTemplate.data,
    "model:ndksong": NdkMonographVolumeTemplate.data,
    "model:ndktrack": NdkMonographVolumeTemplate.data,
    "model:ndkaudiopage": NdkMonographVolumeTemplate.data,
    "model:chronicletitle": NdkMonographVolumeTemplate.data,
    "model:chroniclevolume": NdkMonographVolumeTemplate.data,
    "model:chroniclesupplement": NdkMonographVolumeTemplate.data,
    "model:bdmarticle": NdkMonographVolumeTemplate.data
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