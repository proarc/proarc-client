
export class Page {

  public pid: string;
  public timestamp: number;

  public index: string;
  public number: string;
  public type: string;
  public note: string;
  public identifiers: PageIdentifier[];
  public position: string;
  public genre: string = 'page';

  public originalIndex: string;
  public originalNumber: string;
  public originalType: string;
  public originalNote: string;
  public originalPosition: string;
  public originalGenre: string;
  public originalIdentifiers: PageIdentifier[];

  public model: string;

  constructor() {
    this.identifiers = [];
    this.originalIdentifiers = [];
  }

  public static pageFromJson(json: any, model: string): Page {
      const page = new Page();
      page.model = model;
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

  public static ndkPageFromJson(json: any, model: string): Page {
    const page = new Page();
    page.model = model;
    page.pid = json['pid'];
    page.timestamp = json['timestamp'];
    if (json['jsonData']) {
      const data = json['jsonData'];
      page.index = data['pageIndex'];
      page.number = data['pageNumber'];
      page.type = data['pageType'];
      if (page.type && page.type.length > 0) {
        page.type = page.type.substr(0, 1).toLowerCase() + page.type.substr(1);
      }
      if (data['identifiers']) {
        page.identifiers = PageIdentifier.fromJsonArray(data['identifiers']);
        page.originalIdentifiers = PageIdentifier.fromJsonArray(data['identifiers']);
      }
      const mods = data['mods']
      if (mods) {
        if (mods['note'] && mods['note'][0] && mods['note'][0]['value']) {
          page.position = mods['note'][0]['value'];
        }
        if (mods['genre'] && mods['genre'][0] && mods['genre'][0]['value']) {
          page.genre = mods['genre'][0]['value'];
        }
        if (mods['physicalDescription'] && mods['physicalDescription'][0] && mods['physicalDescription'][0]['note'] && mods['physicalDescription'][0]['note'][0] && mods['physicalDescription'][0]['note'][0]['value']) {
          page.note = mods['physicalDescription'][0]['note'][0]['value'];
        }
        if (mods['identifier']) {
          page.identifiers = PageIdentifier.fromJsonArray(mods['identifier']);
          page.originalIdentifiers = PageIdentifier.fromJsonArray(mods['identifier']);
        } 
      }
      page.originalPosition = page.position;
      page.originalGenre = page.genre;
      page.originalIndex = page.index;
      page.originalNumber = page.number;
      page.originalType = page.type;
      page.originalNote = page.note;
    }
    return page;
  }

  public static fromJson(json: any, model: string): Page {
    if (model == 'model:ndkpage') {
      return Page.ndkPageFromJson(json, model)
    } else {
      return Page.pageFromJson(json, model);
    }
  }

  public toJson() {
    return (this.isNdkPage() || this.isSttPage()) ? this.ndkPageToJson() : this.pageToJson();
  }

  private pageToJson() {
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
    };
  }

  private ndkPageToJson() {
    const ids = [];
    for (const i of this.identifiers) {
      ids.push(i.toJson());
    }
    const mods: any = { 
      'identifier': ids
    };
    if (this.position) {
      mods['note'] = [ { 'value': this.position } ];
    }
    if (this.genre) {
      mods['genre'] = [ { 'value': this.genre } ];
    }
    if (this.note) {
      mods['physicalDescription'] = [ { 'note': [ { 'value': this.note  }] } ];
    }
    return {
      'mods': mods,
      'pageNumber': this.number,
      'pageIndex': this.index,
      'pageType': this.type
    };
  }

  public isValid(): boolean {
    return !!this.index && !!this.number && !!this.type && (!this.isNdkPage() || !!this.genre);
  }

  public isNdkPage(): boolean {
    return this.model === 'model:ndkpage';
  }

  public isSttPage(): boolean {
    return this.model === 'model:oldprintpage';
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
    this.number = this.originalNumber;
    this.type = this.originalType;
    this.note = this.originalNote;
    this.position = this.originalPosition;
    this.genre = this.originalGenre;
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
    return this.index !== this.originalIndex || this.number !== this.originalNumber
    || this.type !== this.originalType || this.note !== this.originalNote 
    || this.position !== this.originalPosition || this.genre !== this.originalGenre;
  }

  

  public toXml(): string {
    let ret = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <mods:mods version="3.6" xmlns:mods="http://www.loc.gov/mods/v3" xmlns:xlink="http://www.w3.org/1999/xlink">
    <mods:genre type="${this.type}">${this.genre}</mods:genre>
    <mods:identifier type="uuid">${this.pid}</mods:identifier>
    <mods:part type="${this.type}">
    <mods:detail type="pageNumber">
    <mods:number>${this.number}</mods:number>
    </mods:detail>
    </mods:part>
    <mods:part>
    <mods:detail type="pageIndex"> 
    <mods:number>${this.index}</mods:number>
    </mods:detail>
    </mods:part>
    `;

    if (this.position) {
      ret = `${ret}<mods:note>${this.position}</mods:note>`
    }

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
