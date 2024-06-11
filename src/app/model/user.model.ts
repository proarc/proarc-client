
export class User {


  public userId: number;
  public userGroup: number;

  public name: string;
  public password: string;
  public forename: string;
  public surname: string;
  public home: string;
  public email: string;
  public timestamp: Date;
  public created: Date;
  public organization: string;
  public role: string;

  public changeModelFunction: boolean;
  public unlockObjectFunction: boolean;
  public updateModelFunction: boolean;
  public lockObjectFunction: boolean;
  public importToProdFunction: boolean;
  public czidloFunction: boolean;
  public wfDeleteJobFunction: boolean;

  public static fromJson(json: any): User {
      const user = new User();
      user.userId = json['userId'];
      user.userGroup = json['userGroup'];
      user.name = json['name'];
      user.forename = json['forename'] || "";
      user.surname = json['surname'] || "";
      user.home = json['home'];
      user.email = json['email'];
      user.timestamp = new Date(json['timestamp']);
      user.created = new Date(json['created']);
      user.organization = json['organization'];
      user.role = json['role'];
      user.changeModelFunction = json['changeModelFunction'];
      user.unlockObjectFunction = json['unlockObjectFunction'];
      user.updateModelFunction = json['updateModelFunction'];
      user.lockObjectFunction = json['lockObjectFunction'];
      user.importToProdFunction = json['importToProdFunction'];
      user.czidloFunction = json['czidloFunction'];
      return user;
  }

  public static fromJsonArray(jsonArray: any[]): User[] {
    const array: User[] = [];
    for (const json of jsonArray) {
        array.push(User.fromJson(json));
    }
    return array;
  }

}
