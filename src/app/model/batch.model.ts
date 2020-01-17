
export class Batch {

  public id: number;
  public description: string;
  public timestamp: string;
  public create: string;
  public state: string;
  public userId: number;
  public user: string;
  public profile: string;

  public static fromJson(json): Batch {
      const batch = new Batch();
      batch.id = json['id'];
      batch.description = json['description'];
      batch.timestamp = json['timestamp'];
      batch.create = json['create'];
      batch.state = json['state'];
      batch.userId = json['userId'];
      batch.user = json['user'];
      batch.profile = json['profile'];
      return batch;
  }
  
}
