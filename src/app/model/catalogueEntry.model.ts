
export class CatalogueEntry {

  public id: number;
  public mods: string;
  public preview: string;
  public title: string;

  public static fromJson(json: any): CatalogueEntry {
    const entry = new CatalogueEntry();
    entry.id = json['id'];
    entry.mods = json['mods'];
    entry.preview = json['preview'];
    entry.title = json['title'];
    return entry;
  }

  public static fromJsonArray(jsonArray: any[]): CatalogueEntry[] {
    const array: CatalogueEntry[] = [];
    for (const json of jsonArray) {
        array.push(CatalogueEntry.fromJson(json));
    }
    return array;
  }

}
