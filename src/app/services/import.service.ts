import { Injectable } from '@angular/core';
import { Folder } from '../model/folder.model';

@Injectable()
export class ImportService {

  folders: Folder[];

  constructor() {
    this.folders = [];
  }

  init() {
    this.folders = [];
  }

  toggleFoder(folder: Folder) {
    const idx = this.folders.indexOf(folder);
    if (idx >= 0) {
      this.folders.splice(idx, 1);
    } else {
      this.folders.push(folder);
    }
  }

  isFolderSelected(folder: Folder): boolean {
    return this.folders.indexOf(folder) >= 0;
  }

  anyFolderSelected(): boolean {
    return this.folders.length > 0;
  }

}
