export class PremisAgent {
  json: any;
  id: string;

  constructor(json: any) {
    this.id = json['$'].ID;
    this.json = json;
    // this.type = json['$']['xsi:type'];
    // json['mets:mdWrap'][0]['mets:xmlData'][0]['premis:object'].forEach((o: any) => {
    //   this.objectIdentifier.push(new PremisObjectIdentifier(o['premis:objectIdentifier'][0]));
    // });
  }
}