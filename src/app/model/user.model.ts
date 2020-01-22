
export class User {


  public id: number;
  public group: number;
  public name: string;
  public surname: string;
  public home: string;
  public timestamp: Date;
  public create: Date;
  public state: string;
  public userId: number;
  public user: string;
  public profile: string;

  public static fromJson(json): User {
      const user = new User();
      user.id = json['id'];
      user.group = json['group'];
      user.name = json['name'];
      user.surname = json['surname'];
      user.home = json['home'];
      user.timestamp = new Date(json['timestamp']);
      user.create = new Date(json['create']);
      return user;
  }

  public static fromJsonArray(jsonArray): User[] {
    const array: User[] = [];
    for (const json of jsonArray) {
        array.push(User.fromJson(json));
    }
    return array;
  }

}
