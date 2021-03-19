
export class Mods {

  public pid: string;
  public original: string;
  public content: string;
  public timestamp: number;

  public static fromJson(json): Mods {
      const mods = new Mods();
      mods.pid = json['pid'];
      mods.original = json['content'];
      mods.content = json['content'];
      mods.timestamp = json['timestamp'];
      return mods;
  }

  public isEmpty(): boolean {
    return !this.content;
  }

  public restore() {
    this.content = this.original;
  }

  public hasChanged(): boolean {
    return this.original !== this.content;
  }

}
