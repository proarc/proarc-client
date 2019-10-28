
export class Ocr {

  public pid: string;
  public content: string;
  public timestamp: number;

  public static fromJson(json): Ocr {
      console.log(json);
      const ocr = new Ocr();
      ocr.pid = json['pid'];
      ocr.content = json['content'];
      ocr.timestamp = json['timestamp'];
      return ocr;
  }

  public isEmpty(): boolean {
    return !this.content;
  }


}
