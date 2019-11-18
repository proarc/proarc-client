import { Metadata } from "./metadata.model";
import { DocumentItem } from "./documentItem.model";

export class DocumentWrapper {

  public readonly pid: string;
  public metadata: Metadata;
  public item: DocumentItem;

  public children: DocumentItem[];

  constructor(pid: string) {
    this.pid = pid;
    this.children = [];
  }

  public static fromDocumentItem(item: DocumentItem): DocumentWrapper {
    const document = new DocumentWrapper(item.pid);
    document.item = item;
    return document;
  }

  public onlyPageChildren(): boolean {
    for (const child of this.children) {
      if (!child.isPage()) {
        return false;
      }
    }
    return true;
  }

  public isPage(): boolean {
    return this.item.isPage();
  }

}
