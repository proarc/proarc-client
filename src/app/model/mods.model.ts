
export class Mods {

  public pid: string;
  public original: string;
  public content: string;
  public timestamp: number;

  public static fromJson(json): Mods {
      const ocr = new Mods();
      ocr.pid = json['pid'];
      ocr.original = json['content'];
      ocr.content = json['content'];
      ocr.timestamp = json['timestamp'];
      return ocr;
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
