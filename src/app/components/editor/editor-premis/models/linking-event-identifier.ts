import { PremisUtils } from "./premis-utils";

export class LinkingEventIdentifier {

  json: any;  // holds json from xml
  access = 'M';
  selector = 'premis:object/premis:linkingEventIdentifier';
  help = ['identifikátor události týkající původního skenu PS; typy událostí mohou být např. vytvoření, smazání 0-n pro PS nutný link na události vytvoření (digitalizace) a jeho vymazání<br/>',
  ' - <code>linkingEventIdentifierType</code>: typ identifikátoru události, např. UUID, NK_eventID, vlastní číslovací systém apod.',
  ' - <code>linkingEventIdentifierValue</code>: hodnota identifikátoru, např. event_01; img0001-master-event001 apod.'];
  labelKey = 'linkingEventIdentifier';
  collapsed: false;
  

  public get linkingEventIdentifierType(): string {
    return PremisUtils.getProperty(this.json, 'linkingEventIdentifierType');
  };

  public set linkingEventIdentifierType(value: string) {
    PremisUtils.setProperty(this.json, 'linkingEventIdentifierType', value);
  }

  get linkingEventIdentifierValue(): string {
    return PremisUtils.getProperty(this.json, 'linkingEventIdentifierValue');
  };

  public set linkingEventIdentifierValue(value: string) {
    PremisUtils.setProperty(this.json, 'linkingEventIdentifierValue', value);
  }

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {

    return this.isValidProperty('linkingEventIdentifierType') &&  
    this.isValidProperty('linkingEventIdentifierValue');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof LinkingEventIdentifier]
    return p !== undefined && p !== null && p !== ''
  }

}