import { PremisUtils } from "./premis-utils";


export class Relationship {

  json: any;  // holds json from xml
  access = 'M';
  selector = 'premis:object/premis:relationship';
  help = ['vyjádření vztahu popisovaného souboru k jiným souborům a událostem (eventům)<br/>',
  ' - <code>relationshipType</code>: typ vztahu, doporučené hodnoty: derivation= vztah kde objekt je výsledkem změny jiného objektu; structural= vztah mezi částmi objektu; tj. např. ALTO vytvořené z TIFFU bude mít vztah derivation, podobně jako JPEG2000 z TIFFu vytvořený;',
  ' - <code>relationshipSubType</code>: upřesnění vztahu, doporučené hodnoty: created from; has source; is source of; has sibling; has part; is part of; has root; includes; is included in; apod.; tj. např. ALTO nebo JPEG2000 vytvořený z původního TIFFu budou mít vztah &quot;created from&quot;',
  ' - <code>relatedEventIdentification</code>: identifikace s popisovaným souborem související události (eventu); seznam událostí viz PREMIS event 0-n',
  ' - <code>relatedObjectIdentification</code>: identifikace souvisejícího souboru 1-n pro MC, XML pro vyjádření vztahu k původnímu objektu (skenu)'];
  labelKey = 'relationship';
  collapsed: false;
  

  public get relationshipType(): string {
    return PremisUtils.getProperty(this.json, 'relationshipType');
  };

  public set relationshipType(value: string) {
    PremisUtils.setProperty(this.json, 'relationshipType', value);
  }

  get relationshipSubType(): string {
    return PremisUtils.getProperty(this.json, 'relationshipSubType');
  };

  public set relationshipSubType(value: string) {
    PremisUtils.setProperty(this.json, 'relationshipSubType', value);
  }

  get relatedEventIdentification(): string {
    return PremisUtils.getProperty(this.json, 'relatedEventIdentification');
  };

  public set relatedEventIdentification(value: string) {
    PremisUtils.setProperty(this.json, 'relatedEventIdentification', value);
  }

  get relatedObjectIdentification(): string {
    return PremisUtils.getProperty(this.json, 'relatedObjectIdentification');
  };

  public set relatedObjectIdentification(value: string) {
    PremisUtils.setProperty(this.json, 'relatedObjectIdentification', value);
  }

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {

    return this.isValidProperty('relationshipType') &&  
    this.isValidProperty('relationshipSubType') &&  
    this.isValidProperty('relatedEventIdentification') &&  
    this.isValidProperty('relatedObjectIdentification');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof Relationship]
    return p !== undefined && p !== null && p !== ''
  }

}