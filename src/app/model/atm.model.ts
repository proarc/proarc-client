
export class Atm {

    public pid: string;
    public model: string;
    public state: string;
    public owner: string;
    public modified: string;
    public created: string;
    public exportResult: string;

  public static fromJson(json): Atm {
      console.log(json);
      const atm = new Atm();
      atm.pid = json['pid'];
      atm.model = json['model'];
      atm.state = json['state'];
      atm.owner = json['owner'];
      atm.modified = json['modified'];
      atm.created = json['created'];
      atm.exportResult = json['exportResult'];
      return atm;
  }


}
