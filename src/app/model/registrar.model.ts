
export class Registrar {

  public id: string;
  public name: string;

  public static fromJson(json): Registrar {
      const registrar = new Registrar();
      registrar.id = json['id'];
      registrar.name = json['name'];
      return registrar;
  }

  public static fromJsonArray(jsonArray): Registrar[] {
    const array: Registrar[] = [];
    for (const json of jsonArray) {
        array.push(Registrar.fromJson(json));
    }
    return array;
  }

}
