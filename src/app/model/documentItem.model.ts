
export class DocumentItem {

  public pid: string;
  public parent: string;
  public model: string;
  public state: string;
  public label: string;
  public owner: string;
  public modified: Date;
  public created: Date;
  public export: number;

  public static fromJson(json): DocumentItem {
    console.log(json);
    const item = new DocumentItem();
    item.pid = json['pid'];
    item.parent = json['pid'];
    item.model = json['model'];
    item.state = json['state'];
    item.owner = json['owner'];
    item.label = json['label'];
    if (json['modified']) {
      item.modified = new Date(json['modified']);
    }
    if (json['created']) {
      item.created = new Date(json['created']);
    }
    item.export = json['export'];
    return item;
  }


  public static fromJsonArray(jsonArray): DocumentItem[] {
    const array: DocumentItem[] = [];
    for (const json of jsonArray) {
        array.push(DocumentItem.fromJson(json));
    }
    return array;
}


}
