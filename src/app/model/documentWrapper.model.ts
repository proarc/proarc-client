import { Metadata } from "./metadata.model";
import { DocumentItem } from "./documentItem.model";

export class DocumentWrapper {

public readonly pid: string;
public metadata: Metadata;
public model: string;
public owner: string;
public label: string;
public modified: Date;
public created: Date;

constructor(pid: string) {
  this.pid = pid;
}

public static fromDocumentItem(item: DocumentItem): DocumentWrapper {
  const document = new DocumentWrapper(item.pid);
  document.model = item.model;
  document.owner = item.owner;
  document.label = item.label;
  document.modified = item.modified;
  document.created = item.created;
  return document;
}


}
