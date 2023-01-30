import { PremisUtils } from "./premis-utils";


export class PreservationLevel {
  json: any;  // holds json from xml
  access = 'M';
  selector = 'premis:object/premis:preservationLevel';
  help = ['údaje o úrovni ochrany souboru, která se na něj vztahuje; některé soubory nejsou tak důležité jako jiné, mají menší úroveň ochrany.<br/>',
    ' - <code>preservationLevelValue</code>: hodnota úrovně ochrany, která je pro soubor relevantní, pro původní sken PS hodnota deleted, pro MC a XML hodnota preservation',
    ' - <code>preservationLevelDateAssigned</code>: datum, kdy byla přiřazena hodnota úrovně ochrany, zápis v ISO 8601, na úroveň dne (DD-MM-RRRR)',
    ' - <code>preservationLevelRole</code>: Role',
    ' - <code>preservationLevelRationale</code>: Rationale'];
  labelKey = 'preservationLevel';
  collapsed: false;

  public get preservationLevelValue(): string {
    this.checkProperty('preservationLevelValue');
    return  this.json['premis:preservationLevelValue'][0]._;
  };

  public set preservationLevelValue(value: string) {
    this.setProperty('preservationLevelValue', value);
  }

  get preservationLevelDateAssigned(): string {
    this.checkProperty('preservationLevelDateAssigned');
    return this.json['premis:preservationLevelDateAssigned'][0]._;
  };

  public set preservationLevelDateAssigned(value: string) {
    this.setProperty('preservationLevelDateAssigned', value);
  }

  get preservationLevelRole(): string {
    this.checkProperty('preservationLevelRole');
    return this.json['premis:preservationLevelRole'][0]._;
  };

  public set preservationLevelRole(value: string) {
    this.setProperty('preservationLevelRole', value);
  }

  get preservationLevelRationale(): string {
    this.checkProperty('preservationLevelRationale');
    return this.json['premis:preservationLevelRationale'][0]._;
  };

  public set preservationLevelRationale(value: string) {
    this.setProperty('preservationLevelRationale', value);
  }

  setProperty(property: string, value: string) {
    if (!this.json['premis:'+property]) {
      this.json['premis:'+property] = [{ _: value }];
      return;
    }
    if (this.json['premis:'+property][0].hasOwnProperty('_')) {
      this.json['premis:'+property][0]._ = value;
    } else {
      this.json['premis:'+property][0] = { _: value };
    }

  }

  checkProperty(property: string) {
    if (!this.json['premis:'+property]) {
      this.json['premis:'+property] = [{ _: '' }];
      return;
    }
  }

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {
    return this.isValidProperty('preservationLevelValue'); // &&  
    //this.isValidProperty('preservationLevelDateAssigned') &&  
    //this.isValidProperty('preservationLevelRole') &&  
    //this.isValidProperty('preservationLevelRationale');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof PreservationLevel]
    return p !== undefined && p !== null && p !== ''
  }
}
