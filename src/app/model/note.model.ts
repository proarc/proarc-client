
export class Note {

  public pid: string;
  public content: string;
  public timestamp: number;

  public static fromJson(json): Note {
      const note = new Note();
      note.pid = json['pid'];
      note.content = json['content'];
      note.timestamp = json['timestamp'];
      return note;
  }

}
