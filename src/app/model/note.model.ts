
export class Note {

  public pid: string;
  public original: string;
  public content: string;
  public timestamp: number;

  public static fromJson(json: any): Note {
      const note = new Note();
      note.pid = json['pid'];
      note.original = json['content'];
      note.content = json['content'];
      note.timestamp = json['timestamp'];
      return note;
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
