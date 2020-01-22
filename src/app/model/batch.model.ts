
export class Batch {

  public id: number;
  public description: string;
  public timestamp: Date;
  public create: Date;
  public state: string;
  public userId: number;
  public user: string;
  public profile: string;

  public static fromJson(json): Batch {
      const batch = new Batch();
      batch.id = json['id'];
      batch.description = json['description'];
      batch.timestamp = new Date(json['timestamp']);
      batch.create = new Date(json['create']);
      batch.state = json['state'];
      batch.userId = json['userId'];
      batch.user = json['user'];
      batch.profile = json['profile'];
      return batch;
  }

  public static fromJsonArray(jsonArray): Batch[] {
    const array: Batch[] = [];
    for (const json of jsonArray) {
        array.push(Batch.fromJson(json));
    }
    return array;
  }

  public static statusFromJson(json): [number, number] {
    if (!json) {
      return null;
    }
    return [json['endRow'], json['totalRows']];
  }
  
}
