import { LinkingEventIdentifier } from "./linking-event-identifier";
import { ObjectCharacteristics } from "./object-characteristics";
import { PremisObjectIdentifier } from "./premis-object-identifier";
import { PremisUtils } from "./premis-utils";
import { PreservationLevel } from "./preservation-level";
import { Relationship } from "./relationship";
import { SignificantProperties } from "./significant-properties";

export class PremisObject {
  json: any;
  id: string;

  access = 'M';
  selector = 'premis:object';
  help = ['Kořenový element pro premis objekt; použít vždy s atributem podle typu objektu.'];
  labelKey = 'object';
  collapsed: false;

  type: string; //"file" - pro soubor; "representation" - pro digitální reprezentaci; "bitstream" - pro bitstream
  objectIdentifier: PremisObjectIdentifier[] = [];
  preservationLevel: PreservationLevel[] = [];
  significantProperties: SignificantProperties[] = [];
  objectCharacteristics: ObjectCharacteristics[] = [];
  relationship: Relationship[] = [];
  linkingEventIdentifier: LinkingEventIdentifier[] = [];


  public get originalName(): string {
    return PremisUtils.getProperty(this.json, 'originalName');
  };
  public set originalName(value: string) {
    PremisUtils.setProperty(this.json, 'originalName', value);
  }

  public get storage(): string {
    return PremisUtils.getProperty(this.json, 'storage');
  };
  public set storage(value: string) {
    PremisUtils.setProperty(this.json, 'storage', value);
  }

  isValid(): boolean {
    if (this.objectIdentifier.length === 0) {
      return false;
    }

    const oi = this.objectIdentifier.filter(o => !o.isValid());
    if (oi.length > 0) {
      return false;
    }

    return true;
  }

  constructor(json: any) {
    this.id = json['$'].ID;
    const o = json['mets:mdWrap'][0]['mets:xmlData'][0]['premis:object'][0];
    this.json = o;
    this.type = o['$']['xsi:type'];
    
    this.objectIdentifier.push(new PremisObjectIdentifier(o['premis:objectIdentifier'][0]));
    this.preservationLevel.push(new PreservationLevel(o['premis:preservationLevel'][0]));
    if (o['premis:significantProperties']) {
      this.significantProperties.push(new SignificantProperties(o['premis:significantProperties'][0]));
    }
    
    if (o['premis:objectCharacteristics']) {
      this.objectCharacteristics.push(new ObjectCharacteristics(o['premis:objectCharacteristics'][0]));
    }
    
    if (o['premis:relationship']) {
      this.relationship.push(new Relationship(o['premis:relationship'][0]));
    }
    
    if (o['premis:linkingEventIdentifier']) {
      this.linkingEventIdentifier.push(new LinkingEventIdentifier(o['premis:linkingEventIdentifier'][0]));
    }
  }

}
