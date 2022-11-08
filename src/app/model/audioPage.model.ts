
export class AudioPage {

  public pid: string;
  public timestamp: number;

  public index: string;
  public note: string;
  public identifiers: PageIdentifier[];

  public originalIndex: string;
  public originalNote: string;
  public originalIdentifiers: PageIdentifier[];

  public model: string;

  constructor() {
    this.identifiers = [];
    this.originalIdentifiers = [];
  }

  public static fromJson(json: any, model: string): AudioPage {
    const audioPage = new AudioPage();
    audioPage.model = model;
    audioPage.pid = json['pid'];
    audioPage.timestamp = json['timestamp'];
    if (json['jsonData']) {
      const data = json['jsonData'];
      audioPage.index = data['pageIndex'];
      audioPage.note = data['note'];
      audioPage.identifiers = PageIdentifier.fromJsonArray(data['identifiers']);
      audioPage.originalIndex = audioPage.index;
      audioPage.originalNote = audioPage.note;
      audioPage.originalIdentifiers = PageIdentifier.fromJsonArray(data['identifiers']);
    }
    return audioPage;
  }

  public toJson() {
    const ids = [];
    for (const i of this.identifiers) {
      ids.push(i.toJson());
    }
    return {
      'identifiers': ids,
      'pageIndex': this.index,
      'note': this.note,
    };
  }

  public isValid(): boolean {
    return !!this.index;
  }

  public removeIdentifier(index: number) {
    if (index >= 0 && index < this.identifiers.length) {
      this.identifiers.splice(index, 1);
    }
  }

  public addIdentifier() {
    this.identifiers.push(new PageIdentifier('', ''));
  }

  public addIdentifierAfter(index: number) {
    this.identifiers.splice(index + 1, 0, new PageIdentifier('', ''));
  }

  public moveIdentifierDown(index: number) {
    if (index < this.identifiers.length - 1) {
        const x = this.identifiers[index];
        this.identifiers[index] = this.identifiers[index + 1];
        this.identifiers[index + 1] = x;
    }
  }

  public moveIdentifierUp(index: number) {
    if (index > 0) {
        const x = this.identifiers[index];
        this.identifiers[index] = this.identifiers[index - 1];
        this.identifiers[index - 1] = x;
    }
  }

  public restore() {
    this.index = this.originalIndex;
    this.note = this.originalNote;
    this.identifiers = [];
    for (const id of this.originalIdentifiers) {
      this.identifiers.push(new PageIdentifier(id.type, id.value));
    }
  }

  public removeEmptyIdentifiers() {
    for (let i = this.identifiers.length - 1; i >= 0; i--) {
      if (this.identifiers[i].isEmpty()) {
        this.identifiers.splice(i, 1);
      }
    }
  }

  public hasChanged(): boolean {
    if (this.identifiers.length !== this.originalIdentifiers.length) {
      return true;
    }
    for (let i = 0; i < this.identifiers.length; i++) {
      if (!this.identifiers[i].equalTo(this.originalIdentifiers[i])) {
        return true;
      }
    }
    return this.index !== this.originalIndex || this.note !== this.originalNote;
  }



  public toXml(): string {
    let ret = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <mods:mods version="3.6" xmlns:mods="http://www.loc.gov/mods/v3" xmlns:xlink="http://www.w3.org/1999/xlink">
    <mods:identifier type="uuid">${this.pid}</mods:identifier>
    <mods:part>
    <mods:detail type="pageIndex">
    <mods:number>${this.index}</mods:number>
    </mods:detail>
    </mods:part>
    `;

    if (this.note) {
      ret = `${ret}
      <mods:physicalDescription><mods:note>${this.note}</mods:note></mods:physicalDescription>`
    }

    ret = `${ret}
    </mods:mods>`
    return ret;
  }
}

export class PageIdentifier {

  public type: string;
  public value: string;

  constructor(type: string, value: string) {
    this.type = type;
    this.value = value;
  }

  public static fromJsonArray(array: any[]): PageIdentifier[] {
    const identifiers = [];
    for (const id of array) {
      if (id) {
        identifiers.push(new PageIdentifier(id['type'], id['value']));
      }
    }
    return identifiers;
  }

  public equalTo(page: PageIdentifier): boolean {
    return this.type === page.type && this.value === page.value;
  }

  public isEmpty(): boolean {
    return !this.type && !this.value;
  }

  public toJson() {
    return {
      'type': this.type,
      'value': this.value
    };
  }
}
