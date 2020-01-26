
export class Ruian {

  public layerId: number;
  public layerName: string;
  public label: string;
  public code: string;
  public value: string;

  // public parentCode: string;
  // public parentLayerId: number;

  public parents: any[];

  public static fromJson(json): Ruian {
      const ruian = new Ruian();
      ruian.parents = [];
      ruian.layerId = json['layerId'];
      ruian.layerName = json['layerName'];
      const attrs = json['attributes'];
      if (attrs) {
        ruian.code = attrs['kod'];
        ruian.value = attrs['nazev'];
        if (ruian.layerId === 4) {
          ruian.label = attrs['ulice'];
        } else if (ruian.layerId === 1) {
          ruian.label = attrs['adresa'];
          ruian.value = attrs['adresa'];
        }
        if (attrs['ulice'] && ruian.layerId === 1) {
          ruian.parents.push({ layer: 4, code: attrs['ulice']});
        }
        if (attrs['stavebniobjekt']) {
          ruian.parents.push({ layer: 3, code: attrs['stavebniobjekt']});
        }
        if (attrs['katastralniuzemi']) {
          ruian.parents.push({ layer: 7, code: attrs['katastralniuzemi']});
        }
        if (attrs['castobce']) {
          ruian.parents.push({ layer: 11, code: attrs['castobce']});
        }
        if (attrs['obec']) {
          ruian.parents.push({ layer: 12, code: attrs['obec']});
        }
        if (attrs['pou']) {
          ruian.parents.push({ layer: 13, code: attrs['pou']});
        }
        if (attrs['orp']) {
          ruian.parents.push({ layer: 14, code: attrs['orp']});
        }
        if (attrs['okres']) {
          ruian.parents.push({ layer: 15, code: attrs['okres']});
        }
        if (attrs['kraj']) {
          ruian.parents.push({ layer: 16, code: attrs['kraj']});
        }
        if (attrs['vusc']) {
          ruian.parents.push({ layer: 17, code: attrs['vusc']});
        }
        if (attrs['regionsoudrznosti']) {
          ruian.parents.push({ layer: 18, code: attrs['regionsoudrznosti']});
        }
        if (attrs['stat']) {
          ruian.parents.push({ layer: 19, code: attrs['stat']});
        }
        if (!ruian.label) {
          ruian.label = attrs['nazev'];
        }
      }
      if (!ruian.label) {
        ruian.label = json['value'];
      }
      return ruian;
  }

  public static fromJsonArray(jsonArray): Ruian[] {
    const array: Ruian[] = [];
    for (const json of jsonArray) {
        array.push(Ruian.fromJson(json));
    }
    return array;
  }

}
