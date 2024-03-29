
export class Catalogue {

  public id: string;
  public name: string;
  public fields: CatalogueField[];

  public static fromJson(json: any): Catalogue {
      const catalog = new Catalogue();
      catalog.id = json['id'];
      catalog.name = json['name'];
      catalog.fields = [];
      if (json['fields']) {
        for (const filed of json['fields']) {
          if (filed['fieldId']) {
            catalog.fields.push({
              id: filed['fieldId'],
              name: filed['fieldTitle']
            });
          }
        }
      }
      return catalog;
  }


  public static fromJsonArray(jsonArray: any[]): Catalogue[] {
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