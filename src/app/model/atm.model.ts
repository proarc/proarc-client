
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
    public organization: string;
    public userProcessor: string;
    public status: string;
    public isLocked: boolean;
    public lockedBy: string;
    public lockedDate: Date;


    public originalDevice: string;
    public originalOrganization: string;
    public originalUserProcessor: string;
    public originalStatus: string;

  public static fromJson(json: any): Atm {
      const atm = new Atm();
      atm.pid = json['pid'];
      atm.model = json['model'];
      atm.state = json['state'];
      atm.owner = json['owner'];
      atm.originalDevice = json['device'] || 'null';
      atm.device = json['device'] || 'null';
      atm.filename = json['filename'];
      atm.organization = json['organization'];
      atm.userProcessor = json['userProcessor'];
      atm.status = json['status'];
      atm.originalOrganization = json['organization'];
      atm.originalUserProcessor = json['userProcessor'];
      atm.originalStatus = json['status'];
      if (json['modified']) {
        atm.modified = new Date(json['modified']);
      }
      if (json['created']) {
        atm.created = new Date(json['created']);
      }
      atm.exportResult = json['exportResult'];
      atm.isLocked = json['locked'];
      atm.lockedBy = json['lockedBy'];
      atm.lockedDate = json['lockedDate'];
      return atm;
  }

  public restore() {
    this.device = this.originalDevice;
    this.organization = this.originalOrganization;
    this.userProcessor = this.originalUserProcessor;
    this.status = this.originalStatus;
  }

  public hasChanged(): boolean {
    return this.originalDevice !== this.device || this.originalOrganization !== this.organization || this.originalUserProcessor !== this.userProcessor || this.originalStatus !== this.status;
  }


}
