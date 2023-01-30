

export class SignificantProperties {

  json: any;  // holds json from xml
  access = 'R';
  selector = 'premis:object/premis:significantProperties';
  help = ['Signifikantní vlastnosti.<br/>',
  ' - <code>significantPropertiesType</code>: Typ',
  ' - <code>significantPropertiesValue</code>: Hodnota',
  ' - <code>significantPropertiesExtension</code>: Extension'];
  labelKey = 'significantProperties';
  collapsed: false;

  checkProperty(property: string) {
    if (!this.json['premis:'+property]) {
      this.json['premis:'+property] = [{ _: '' }];
      return;
    }
  }
  
  private getProperty(property: string) {
    this.checkProperty(property);
    return  this.json['premis:' + property][0]._;
  }

  public get significantPropertiesType(): string {
    return this.getProperty('significantPropertiesType');
  };

  public set significantPropertiesType(value: string) {
    this.setProperty('significantPropertiesType', value);
  }

  get significantPropertiesValue(): string {
    return this.getProperty('significantPropertiesValue');
  };

  public set significantPropertiesValue(value: string) {
    this.setProperty('significantPropertiesValue', value);
  }

  get significantPropertiesExtension(): string {
    return this.getProperty('significantPropertiesExtension');
  };

  public set significantPropertiesExtension(value: string) {
    this.setProperty('significantPropertiesExtension', value);
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

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {
    return this.isValidProperty('significantPropertiesType') &&  
    this.isValidProperty('significantPropertiesValue') &&  
    this.isValidProperty('significantPropertiesExtension');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof SignificantProperties]
    return p !== undefined && p !== null && p !== ''
  }

}