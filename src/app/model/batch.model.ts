import { DocumentItem } from "./documentItem.model";

export class Batch {

  public id: number;
  public description: string;
  public timestamp: Date;
  public itemUpdated: Date;
  public updated: Date;
  public create: Date;
  public state: string;
  public userId: number;
  public user: string;
  public profile: string;
  public failure: string;
  public parentPid: string;
  public pageCount: number;
  public folderPah: string;
  public priority: string;

  public static fromJson(json: any): Batch {
      const batch = new Batch();
      batch.id = json['id'];
      batch.description = json['description'];
      batch.itemUpdated = new Date(json['itemUpdated']);
      batch.updated = new Date(json['updated']);
      batch.timestamp = new Date(json['timestamp']);
      batch.create = new Date(json['create']);
      batch.state = json['state'];
      batch.userId = json['userId'];
      batch.user = json['user'];
      batch.profile = json['profile'];
      batch.parentPid = json['parentPid'];
      batch.failure = json['failure'];
      batch.pageCount = json['pageCount'] ? parseInt(json['pageCount']) : 0;
      batch.folderPah = json['folderPath'];
      batch.priority = json['priority'];
      return batch;
  }

  public static fromJsonArray(jsonArray: any[]): Batch[] {
    const array: Batch[] = [];
    for (const json of jsonArray) {
        array.push(Batch.fromJson(json));
    }
    return array;
  }

  public static statusFromJson(json: any): [number, number] {
    if (!json) {
      return null;
    }
    return [json['endRow'], json['totalRows']];
  }

  isLoading() {
    return this.state === 'LOADING';
  }

}
