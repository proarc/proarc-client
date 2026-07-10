
export class Profile {

  public id: string;
  public label: string;
  public description: string;
  public params: any;

  public static fromJson(json: any): Profile {
      const profile = new Profile();
      profile.id = json['id'];
      profile.label = json['label'];
      profile.description = json['description'];
      profile.params = json['params'];
      return profile;
  }

  public static fromJsonArray(jsonArray: any[]): Profile[] {
    const array: Profile[] = [];
    for (const json of jsonArray) {
        array.push(Profile.fromJson(json));
    }
    return array;
  }


}
