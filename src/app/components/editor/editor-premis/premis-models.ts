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
    this.json = json;
    this.id = json['$'].ID;
    this.type = json['$']['xsi:type'];
    json['mets:mdWrap'][0]['mets:xmlData'][0]['premis:object'].forEach((o: any) => {
      this.objectIdentifier.push(new PremisObjectIdentifier(o['premis:objectIdentifier'][0]));
      this.preservationLevel.push(new PreservationLevel(o['premis:preservationLevel'][0]));
    });
  }

}

export class PremisObjectIdentifier {

  json: any;  // holds json from xml
  access = 'M';
  selector = 'premis:object/premis:objectIdentifier';
  help = ['Identifikátor k jednoznačnému odlišení objektu v určitém kontextu.<br/>',
    ' - <code>objectIdentifierType</code>: Popis kontextu, ve kterém je identifikátor unikátní, např. NDK, ANL nebo název repozitáře; nutno použít kontrolovaný slovník',
    ' - <code>objectIdentifierValue</code>: Vlastní hodnota identifikátoru, např. img0001-master, urn.nbn.cz123465 apod.'];
  labelKey = 'objectIdentifier';

  public get objectIdentifierType(): string {
    return this.json['premis:objectIdentifierType'][0]._;
  };

  public set objectIdentifierType(value: string) {
    if (this.json['premis:objectIdentifierType'][0].hasOwnProperty('_')) {
      this.json['premis:objectIdentifierType'][0]._ = value;
    } else {
      this.json['premis:objectIdentifierType'][0] = { _: value };
    }

  }

  get objectIdentifierValue(): string {
    return this.json['premis:objectIdentifierValue'][0]._;
  };

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {
    return this.isValidProperty('objectIdentifierType') &&  this.isValidProperty('objectIdentifierValue');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof PremisObjectIdentifier]
    return p !== undefined && p !== null && p !== ''
  }

}

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

  public get preservationLevelValue(): string {
    return  this.json['premis:preservationLevelValue'][0]._;
  };

  public set preservationLevelValue(value: string) {
    this.setProperty('preservationLevelValue', value);
  }

  get preservationLevelDateAssigned(): string {
    return this.json['premis:preservationLevelDateAssigned'][0]._;
  };

  public set preservationLevelDateAssigned(value: string) {
    this.setProperty('preservationLevelDateAssigned', value);
  }

  get preservationLevelRole(): string {
    return this.json['premis:preservationLevelRole'][0]._;
  };

  public set preservationLevelRole(value: string) {
    this.setProperty('preservationLevelRole', value);
  }

  get preservationLevelRationale(): string {
    return this.json['premis:preservationLevelRationale'][0]._;
  };

  public set preservationLevelRationale(value: string) {
    this.setProperty('preservationLevelRationale', value);
  }

  setProperty(property: string, value: string) {
    if (this.json['premis:'+property][0].hasOwnProperty('_')) {
      this.json['premis:'+property][0]._ = value;
    } else {
      this.json['premis:'+property][0] = { _: value };
    }

  }

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {
    return this.isValidProperty('preservationLevelValue') &&  
    this.isValidProperty('preservationLevelDateAssigned') &&  
    this.isValidProperty('preservationLevelRole') &&  
    this.isValidProperty('preservationLevelRationale');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof PreservationLevel]
    return p !== undefined && p !== null && p !== ''
  }
}


export class PremisEvent {
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

export class PremisRights {
  id: string;
}

