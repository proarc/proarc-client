import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { DocumentItem } from '../model/documentItem.model';
import { Metadata } from '../model/metadata.model';
import { Mods } from '../model/mods.model';
import { ApiService } from './api.service';
import { UIService } from './ui.service';
import { LayoutService } from 'src/app/services/layout.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  metadata: Metadata;
  constructor(
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    private layout: LayoutService) { }

  saveMetadata(ignoreValidation: boolean, callback: (r: any) => void) {

    this.api.editMetadata(this.metadata, ignoreValidation).subscribe((response: any) => {
      if (response.errors) {
        if (response.status === -4) {
          // Ukazeme dialog a posleme s ignoreValidation=true
          if (callback) {
            callback(response);
          }
          return;
        } else {
          this.ui.showErrorSnackBarFromObject(response.errors);
          return;
        }
        return;
      }


      const rDoc = this.api.getDocument(this.metadata.pid);
      const rMods = this.api.getMods(this.metadata.pid);
      forkJoin([rDoc, rMods]).subscribe(([doc, responseMods]: [DocumentItem, any]) => {

        const mods: Mods = Mods.fromJson(responseMods['record']);

        this.metadata = Metadata.fromMods(mods, this.metadata.model);
        if (callback) {
          callback(null);
        }
      });
    });
  }

  loadMetadata(callback: (m: Metadata) => void) {
    if (this.metadata && this.metadata.pid === this.layout.selectedItem.pid) {
      callback(this.metadata);
      return;
    }
    if (this.layout.selectedItem.notSaved) {
      this.metadata = new Metadata(this.layout.selectedItem.pid, this.layout.selectedItem.model, this.layout.selectedItem.content, 0);
      callback(this.metadata);
      return;
    }
    this.api.getMetadata(this.layout.selectedItem.pid, this.layout.selectedItem.model).subscribe((metadata: Metadata) => {
      this.metadata = metadata;
      if (callback) {
        callback(metadata);
      }
    });
  }

  updateModsFromCatalog(xml: string) {
    // console.log(mods)
    this.metadata = new Metadata(this.metadata.pid, this.metadata.model, xml, this.metadata.timestamp);
    // this.state = 'success';
  }

  saveModsFromCatalog(xml: string, callback: (m: Mods) => void) {
    this.api.editModsXml(this.metadata.pid, xml, this.metadata.timestamp, false).subscribe((resp: any) => {
      if (resp.errors) {
        this.ui.showErrorSnackBarFromObject(resp.errors);
        this.metadata = new Metadata(this.metadata.pid, this.metadata.model, xml, this.metadata.timestamp);
        setTimeout(() => {
          this.metadata.validate();
        }, 100);
        return;
      }
      this.api.getMods(this.metadata.pid).subscribe((response: any) => {
        if (response.errors) {
          this.ui.showErrorSnackBarFromObject(response.errors);
          return;
        }
        const mods: Mods = Mods.fromJson(response['record']);
        this.metadata = Metadata.fromMods(mods, this.metadata.model);
        callback(mods);
      });
    });
  }

}
