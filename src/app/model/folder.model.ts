
export class Folder {

  public name: string;
  public state: string;
  public path: string;

  public static fromJson(json): Folder {
      const profile = new Folder();
      profile.name = json['name'];
      profile.state = json['state'];
      if (profile.state) {
        profile.state = profile.state.toLowerCase();
      } else {
        profile.state = 'unknown';
      }
      profile.path = json['path'];
      return profile;
  }

  public static fromJsonArray(jsonArray): Folder[] {
    const array: Folder[] = [];
    for (const json of jsonArray) {
        array.push(Folder.fromJson(json));
    }
    return array;
  }


  isNew(): boolean {
    return this.state === 'new';
  }

}
