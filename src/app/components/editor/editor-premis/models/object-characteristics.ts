import { PremisUtils } from "./premis-utils";


export class ObjectCharacteristics {

  json: any;  // holds json from xml
  access = 'R';
  selector = 'premis:object/premis:objectCharacteristics';
  help = ['Technické údaje o souboru.<br/>',
  ' - <code>compositionLevel</code>: údaj o tom, zda je nutné digitální objekt rozbalit nebo dekodovat;	např. 0 (defaultně pro žádné zabalení nebo kodování); 1 pro jedno	zabalení a kodovani, podobně pak hodnota 2',
  ' - <code>creatingApplication</code>: údaje o aplikaci, ve které byl popisovaný soubor vytvořen; nutno popsat skener, SW kde vzniklo ALTO XML/TXT, SW/kodek pro vytvoření JPEG2000 MC',
  ' - <code>fixity</code>: údaje o kontrolním součtu',
  ' - <code>format</code>: údaje o formátu souboru pro soubory ALTO XML je možné vytvořit element dvakrát, jednou popisuje formát XML, podruhé obsahuje informace o použitém standardu ALTO 2.0 (viz příklad 2)',
  ' - <code>size</code>: údaje o velikosti souboru v bytech'];
  labelKey = 'objectCharacteristics';
  collapsed: false;
  

  public get compositionLevel(): string {
    return PremisUtils.getProperty(this.json, 'compositionLevel');
  };

  public set compositionLevel(value: string) {
    PremisUtils.setProperty(this.json, 'compositionLevel', value);
  }

  get creatingApplication(): string {
    return PremisUtils.getProperty(this.json, 'creatingApplication');
  };

  public set creatingApplication(value: string) {
    PremisUtils.setProperty(this.json, 'creatingApplication', value);
  }

  get fixity(): string {
    return PremisUtils.getProperty(this.json, 'fixity');
  };

  public set fixity(value: string) {
    PremisUtils.setProperty(this.json, 'fixity', value);
  }

  get format(): string {
    return PremisUtils.getProperty(this.json, 'format');
  };

  public set format(value: string) {
    PremisUtils.setProperty(this.json, 'format', value);
  }

  get size(): string {
    return PremisUtils.getProperty(this.json, 'size');
  };

  public set size(value: string) {
    PremisUtils.setProperty(this.json, 'size', value);
  }

  constructor(json: any) {
    this.json = json;
  }

  isValid(): boolean {

    return this.isValidProperty('compositionLevel') &&  
    this.isValidProperty('creatingApplication') &&  
    this.isValidProperty('fixity') &&  
    this.isValidProperty('size') &&  
    this.isValidProperty('format');
  }

  isValidProperty(property: any) {
    const p = this[property as keyof ObjectCharacteristics]
    return p !== undefined && p !== null && p !== ''
  }

}