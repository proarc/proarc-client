
export class Profile {

  public id: string;
  public label: string;
  public description: string;

  public static fromJson(json): Profile {
      const profile = new Profile();
      profile.id = json['id'];
      profile.label = json['label'];
      profile.description = json['description'];
      return profile;
  }

  public static fromJsonArray(jsonArray): Profile[] {
    const array: Profile[] = [];
    for (const json of jsonArray) {
        array.push(Profile.fromJson(json));
    }
    return array;
  }


}
