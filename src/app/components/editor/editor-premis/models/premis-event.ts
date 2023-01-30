export class PremisEvent {
  json: any;
  id: string;

  constructor(json: any) {
    this.id = json['$'].ID;
    this.json = json;
  }
}