
export class SearchResult {

  public pid: string;
  public model: string;
  public state: string;
  public label: string;
  public owner: string;
  public modified: Date;
  public created: Date;
  public export: number;

  public static fromJson(json): SearchResult {
    console.log(json);
    const searchResult = new SearchResult();
    searchResult.pid = json['pid'];
    searchResult.model = json['model'];
    searchResult.state = json['state'];
    searchResult.owner = json['owner'];
    searchResult.label = json['label'];
    if (json['modified']) {
      searchResult.modified = new Date(json['modified']);
    }
    if (json['created']) {
      searchResult.created = new Date(json['created']);
    }
    searchResult.export = json['export'];
    return searchResult;
  }


  public static fromJsonArray(jsonArray): SearchResult[] {
    const array: SearchResult[] = [];
    for (const json of jsonArray) {
        array.push(SearchResult.fromJson(json));
    }
    return array;
}


}
