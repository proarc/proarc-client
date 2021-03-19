
export class Catalogue {

  public id: string;
  public name: string;
  public fileds: CatalogueField[];

  public static fromJson(json): Catalogue {
      const catalog = new Catalogue();
      catalog.id = json['id'];
      catalog.name = json['name'];
      catalog.fileds = [];
      if (json['fields']) {
        for (const filed of json['fields']) {
          if (filed['fieldId']) {
            catalog.fileds.push({
              id: filed['fieldId'],
              name: filed['fieldTitle']
            });
          }
        }
      }
      return catalog;
  }


  public static fromJsonArray(jsonArray): Catalogue[] {
    const array: Catalogue[] = [];
    for (const json of jsonArray) {
        array.push(Catalogue.fromJson(json));
    }
    return array;
  }

}

export interface CatalogueField {
  id: string;
  name: string;
}