export class PremisUtils {
  static checkProperty(json: any, property: string) {
    if (!json['premis:'+property]) {
      json['premis:'+property] = [{ _: '' }];
      return;
    }
  }
  
  static getProperty(json: any, property: string) {
    PremisUtils.checkProperty(json, property);
    return  json['premis:' + property][0]._;
  }

  static setProperty(json: any, property: string, value: string) {
    if (!json['premis:'+property]) {
      json['premis:'+property] = [{ _: value }];
      return;
    }
    if (json['premis:'+property][0].hasOwnProperty('_')) {
      json['premis:'+property][0]._ = value;
    } else {
      json['premis:'+property][0] = { _: value };
    }

  }
}