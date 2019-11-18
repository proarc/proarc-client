
export class Page {

  public pid: string;
  public timestamp: number;

  public index: string;
  public number: string;
  public type: string;
  public note: string;
  public identifiers: PageIdentifier[];

  public originalIndex: string;
  public originalNumber: string;
  public originalType: string;
  public originalNote: string;
  public originalIdentifiers: PageIdentifier[];

  constructor() {
    this.identifiers = [];
    this.originalIdentifiers = [];
  }

  public static fromJson(json): Page {
    console.log('json', json);
      const page = new Page();
      page.pid = json['pid'];
      page.timestamp = json['timestamp'];
      if (json['jsonData']) {
        const data = json['jsonData'];
        page.index = data['pageIndex'];
        page.number = data['pageNumber'];
        page.type = data['pageType'];
        page.note = data['note'];
        if (page.type && page.type.length > 0) {
          page.type = page.type.substr(0, 1).toLowerCase() + page.type.substr(1);
        }
        page.identifiers = PageIdentifier.fromJsonArray(data['identifiers']);
        page.originalIndex = page.index;
        page.originalNumber = page.number;
        page.originalType = page.type;
        page.originalNote = page.note;
        page.originalIdentifiers = PageIdentifier.fromJsonArray(data['identifiers']);
      }
      return page;
  }

  public toJson() {
    const ids = [];
    for (const i of this.identifiers) {
      ids.push(i.toJson());
    }
    return {
      'identifiers': ids,
      'pageNumber': this.number,
      'pageIndex': this.index,
      'pageType': this.type,
      'note': this.note,
    }
  }

  public removeIdentifier(index: number) {
    if (index >= 0 && index < this.identifiers.length) {
      this.identifiers.splice(index, 1);
    }
  }

  public addIdentifier() {
    this.identifiers.push(new PageIdentifier("", ""));
  }

  public addIdentifierAfter(index: number) {
    this.identifiers.splice(index + 1, 0, new PageIdentifier("", ""));
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
    this.number = this.originalNumber;
    this.type = this.originalType;
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
    return this.index !== this.originalIndex || this.number !== this.originalNumber || this.type !== this.originalType || this.note !== this.originalNote;
  }
}

export class PageIdentifier {

  public type: string;
  public value: string;

  constructor(type: string, value: string) {
    this.type = type;
    this.value = value;
  }

  public static fromJsonArray(array): PageIdentifier[] {
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
    }
  }
}
