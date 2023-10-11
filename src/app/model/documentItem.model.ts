
export class DocumentItem {

  public pid: string;
  public parent: string;
  public model: string;
  public state: string;
  public label: string;
  public owner: string;
  public modified: Date;
  public created: Date;
  public export: number;
  public archiveExport: number;
  public crossrefExport: number;
  public krameriusExport: number;
  public ndkExport: number;

  public status: string;
  public processor: string;
  public organization: string;

  public shortLabel: string;

  public selected = false;

  public filename: string;
  public pageIndex: string;
  public pageNumber: string;
  public pageType: string;
  public pagePosition: string;

  public invalid: boolean;

  public isLocked: boolean;
  public notSaved: boolean;
  public content: string;

  public timestamp: number;
  public writeExports: string;

  constructor() {
    this.invalid = false;
  }

  public static fromJson(json: any): DocumentItem {
    if (!json) {
      return null;
    }
    const item = new DocumentItem();
    item.pid = json['pid'];
    item.parent = json['parent'];
    item.model = json['model'];
    item.state = json['state'];
    item.owner = json['owner'];
    item.label = json['label'];

    item.status = json['status'];
    item.processor = json['processor'];
    item.organization = json['organization'];


    item.pageIndex = json['pageIndex'] || null;
    item.pageNumber = json['pageNumber'] || null;
    item.pageType = json['pageType'] || null;
    item.pagePosition = json['pagePosition'] || null;

    if (json['timestamp']) {
      item.modified = new Date(json['timestamp']);
    }
    if (json['modified']) {
      item.modified = new Date(json['modified']);
    }
    if (json['created']) {
      item.created = new Date(json['created']);
    }
    if (item.label.indexOf(',') > -1) {
      item.shortLabel = item.label.split(',')[0];
    } else {
      item.shortLabel = item.label;
    }
    item.export = json['export'];
    item.archiveExport = json['archiveExport'];
    item.crossrefExport = json['crossrefExport'];
    item.krameriusExport = json['krameriusExport'];
    item.ndkExport = json['ndkExport'];
    item.isLocked = json['isLocked'];
    if (json['content']) {
      item.content = json['content'];
    }
    item.writeExports = item.writeExports2();
    return item;
  }


  public static fromJsonArray(jsonArray: any[]): DocumentItem[] {
    const array: DocumentItem[] = [];
    for (const json of jsonArray) {
        array.push(DocumentItem.fromJson(json));
    }
    return array;
  }

  public static pagesFromJsonArray(jsonArray: any[]): DocumentItem[] {
    const array: DocumentItem[] = [];
    for (const json of jsonArray) {
      const page = DocumentItem.fromJson(json);
      page.filename = json['filename'] || "";
      page.pageIndex = json['pageIndex'] || "";
      page.pageNumber = json['pageNumber'] || "";
      page.pageType = json['pageType'] || "";
      page.pageType = page.pageType.toLowerCase();
      page.pagePosition = json['pagePosition'] || "";
      let l = page.pageNumber;
      if (l) {
        l += " "
      }
      l += "(" + page.pageIndex + ')';
      page.label = l;
      page.shortLabel = l;
      array.push(page);
    }
    return array;
  }

  public getModel(): string {
    return this.model;
  }

  public isPage(): boolean {
    return this.model === 'model:page' || this.model === 'model:ndkpage' || this.model === 'model:oldprintpage';
  }

  public isValidPage(): boolean {
    // console.log("Model page:" + this.model +" "+ this.pageIndex +" "+ this.pageNumber +" "+ this.pageType)
    return this.isPage() && !!this.pageIndex && !!this.pageNumber && !!this.pageType;
  }

  public isAudioPage(): boolean {
    return this.model == 'model:ndkaudiopage';
  }

  public isValidAudioPage(): boolean {
    // console.log("Model audiopage:" + this.model +" "+ this.pageIndex +" "+ this.pageNumber +" "+ this.pageType)
    return this.isAudioPage() && !!this.pageIndex && !!this.pageType;
  }

  public isMusicDocument(): boolean {
    return this.model === 'model:ndkphonographcylinder' || this.model === 'model:ndkmusicdocument'
      || this.model === 'model:ndksong' || this.model === 'model:ndktrack' || this.model === 'ndkaudiopage';
  }

  // public isVolume(): boolean {
  //   return this.model === 'model:ndkperiodicalvolume';
  // }

  // public isIssue(): boolean {
  //   return this.model === 'model:ndkperiodicalissue';
  // }

  public isChronicle(): boolean {
    return this.model === 'model:chroniclevolume' || this.model === 'model:chronicletitle' || this.model === 'model:chroniclesupplement';
  }

  public isOldprint(): boolean {
    return this.model === 'model:oldprintvolume' || this.model === 'model:oldprintsheetmusic' || this.model === 'model:oldprintmap'
      || this.model === 'model:oldprintgraphics' || this.model === 'model:oldprintomnibusvolume' || this.model === 'model:oldprintchapter'
      || this.model === 'model:oldprintmonographtitle' || this.model === 'model:oldprintsupplement';
  }

  // public isTopLevel(): boolean {
  //   return !this.isPage() && !this.isVolume() && !this.isIssue();
  // }

  public isBdm(): boolean {
    return this.model === 'model:bdmarticle';
  }

  public canContainPdf(): boolean {
    return [
      'model:ndkeperiodical',
      'model:ndkeperiodicalvolume',
      'model:ndkeperiodicalissue',
      'model:ndkearticle',
      'model:ndkemonographtitle',
      'model:ndkemonographvolume',
      'model:ndkechapter',
      'model:bdmarticle'
    ].indexOf(this.model) >= 0;
  }

  writeExports2(): string {
    let exports = "";
    if (this.archiveExport == 1) {
      exports += '/A';
    }
    if (this.crossrefExport == 1) {
      exports += '/C';
    }
    if (this.krameriusExport == 1) {
      exports += '/K';
    }
    if (this.ndkExport == 1) {
      exports += '/N';
    }
    if (exports.length > 0) {
      exports = exports.substring(1);
    }
    return exports;
  }

}
