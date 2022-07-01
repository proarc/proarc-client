
export class Folder {

  public name: string;
  public state: string;
  public states: {profile: string, state: string}[];
  public path: string;
  public level: number;
  public parent: string;
  public expanded: boolean = false;
  public canExpand: boolean = true;
  public loaded: boolean = false;
  public hidden: boolean = false;
  public selected: boolean = false;

  public static fromJson(json: any): Folder {
      const profile = new Folder();
      profile.name = json['name'];
      profile.state = json['state'];
      if (!profile.state) {
        profile.state = 'unknown';
      }
      profile.states = json['states'];
      profile.path = json['path'];
      return profile;
  }

  public static fromJsonArray(jsonArray: any[]): Folder[] {
    const array: Folder[] = [];
    for (const json of jsonArray) {
        array.push(Folder.fromJson(json));
    }
    return array;
  }


  isNew(): boolean {
    return this.state === 'NEW';
  }

  static root(): Folder {
    const folder = new Folder();
    folder.path = '/';
    folder.parent = null;
    folder.name = '/';
    folder.state = 'empty';
    folder.level = 0;
    return folder;
  }


}
