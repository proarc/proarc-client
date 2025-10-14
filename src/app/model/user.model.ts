
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

  public changeModelFunction: boolean;
  public unlockObjectFunction: boolean;
  public lockObjectFunction: boolean;
  public importToProdFunction: boolean;
  public czidloFunction: boolean;
  public wfDeleteJobFunction: boolean;
  public importToCatalogFunction: boolean;
  public changeObjectsOwnerFunction: boolean;
  public deviceFunction: boolean;
  public changePagesFunction: boolean;
  public wfCreateJobFunction: boolean;
  public createUserFunction: boolean;
  public updateUserFunction: boolean;
  public deleteUserFunction: boolean;
  public solrFunction: boolean;
  public deleteActionFunction: boolean;
  public allObjectsFunction: boolean;
  public prepareBatchFunction: boolean;
  public sysAdminFunction: boolean;

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
      user.changeModelFunction = json['changeModelFunction'];
      user.unlockObjectFunction = json['unlockObjectFunction'];
      user.lockObjectFunction = json['lockObjectFunction'];
      user.importToProdFunction = json['importToProdFunction'];
      user.czidloFunction = json['czidloFunction'];
      user.wfDeleteJobFunction = json['wfDeleteJobFunction'];
      user.importToCatalogFunction = json['importToCatalogFunction'];
      user.changeObjectsOwnerFunction = json['changeObjectsOwnerFunction'];
      user.deviceFunction = json['deviceFunction'];
      user.changePagesFunction = json['changePagesFunction'];
      user.wfCreateJobFunction = json['wfCreateJobFunction'];
      user.createUserFunction = json['createUserFunction'];
      user.updateUserFunction = json['updateUserFunction'];
      user.deleteUserFunction = json['deleteUserFunction'];
      user.solrFunction = json['solrFunction'];
      user.deleteActionFunction = json['deleteActionFunction'];
      user.allObjectsFunction = json['allObjectsFunction'];
      user.prepareBatchFunction = json['prepareBatchFunction'];
      user.sysAdminFunction = json['sysAdminFunction'];
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
