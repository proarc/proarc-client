

export class PremisObjectIdentifier {

  json: any;  // holds json from xml
  access = 'M';
  selector = 'premis:object/premis:objectIdentifier';
  help = ['Identifikátor k jednoznačnému odlišení objektu v určitém kontextu.<br/>',
    ' - <code>objectIdentifierType</code>: Popis kontextu, ve kterém je identifikátor unikátní, např. NDK, ANL nebo název repozitáře; nutno použít kontrolovaný slovník',
    ' - <code>objectIdentifierValue</code>: Vlastní hodnota identifikátoru, např. img0001-master, urn.nbn.cz123465 apod.'];
  labelKey = 'objectIdentifier';
  collapsed: false;

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

  public get objectIdentifierValue(): string {
    return this.json['premis:objectIdentifierValue'][0]._;
  };

  public set objectIdentifierValue(value: string) {
    if (this.json['premis:objectIdentifierValue'][0].hasOwnProperty('_')) {
      this.json['premis:objectIdentifierValue'][0]._ = value;
    } else {
      this.json['premis:objectIdentifierValue'][0] = { _: value };
    }

  }

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