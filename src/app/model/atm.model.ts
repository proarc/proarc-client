
export class Atm {

    public pid: string;
    public model: string;
    public device: string;
    public state: string;
    public owner: string;
    public modified: Date;
    public created: Date;
    public exportResult: string;
    public filename: string;

  public static fromJson(json): Atm {
      console.log(json);
      const atm = new Atm();
      atm.pid = json['pid'];
      atm.model = json['model'];
      atm.state = json['state'];
      atm.owner = json['owner'];
      atm.device = json['device'] || 'null';
      atm.filename = json['filename'];
      if (json['modified']) {
        atm.modified = new Date(json['modified']);
      }
      if (json['created']) {
        atm.created = new Date(json['created']);
      }
      atm.exportResult = json['exportResult'];
      return atm;
  }


}
