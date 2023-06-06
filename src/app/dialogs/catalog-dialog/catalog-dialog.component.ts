
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Catalogue, CatalogueField } from 'src/app/model/catalogue.model';
import { CatalogueEntry } from 'src/app/model/catalogueEntry.model';
import { ConfigService } from 'src/app/services/config.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.scss']
})
export class CatalogDialogComponent implements OnInit {

  state = 'none';
  catalogs: Catalogue[];

  activeCatalog: Catalogue;
  activeField: CatalogueField;
  activeQuery: string;

  activeIndex = -1;
  results: CatalogueEntry[];
  message: string;

  private type: string;
  pid: string;
  model: string;
  models: string[];

  displayedColumns: string[] = ['title'];

  constructor(
    public dialogRef: MatDialogRef<CatalogDialogComponent>,
    private api: ApiService,
    private ui: UIService,
    private config: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.state = 'loading';
    this.models = this.config.allModels;
    this.type = this.data['type'];
    if (this.type == 'authors') {
      this.api.getAuthorityCatalogs().subscribe((catalogs: Catalogue[]) => {
        this.onCatalogsLoaded(catalogs);
      });
    } else {
      this.api.getCatalogs().subscribe((catalogs: Catalogue[]) => {
        this.onCatalogsLoaded(catalogs);
      });
    }
  }

  onCatalogsLoaded(catalogs: Catalogue[]) {
    this.catalogs = catalogs;
    if (catalogs.length > 0) {
      this.activeCatalog = catalogs[0];
      this.onCatalogChanged(this.activeCatalog);
    }
    this.state = 'success';
  }

  selectEntry(index: number) {
    if (this.state === 'saving') {
      return;
    }
    this.activeIndex = index;
  }

  onCatalogChanged(catalog: Catalogue) {
    if (catalog.fields.length > 0) {
      if (this.activeField && catalog.fields.indexOf(this.activeField) > -1) {
        return;
      }
      this.activeField = catalog.fields[0];
    } else {
      this.activeField = null;
    }
  }

  search() {
    this.message = null;
    this.activeIndex = -1;
    this.state = 'loading';
    this.results = [];
    const catalog = this.activeCatalog.id;
    const field = this.activeField;
    const query = this.activeQuery;
    this.api.getCatalogSearchResults(this.type, catalog, field.id, query).subscribe((response: any) => {
      if (response['metadataCatalogEntries']) {
        this.results = CatalogueEntry.fromJsonArray(response['metadataCatalogEntries']['entry']);
        if (this.results.length > 0) {
          this.activeIndex = 0;
        } else {
          this.message = 'no-results';
        }
        this.state = 'success';
        this.dialogRef.updateSize('1200px', '90%');
      } else if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = 'search-error';
        return;
      }
    }
    );
  }




  onSave() {
    if (this.activeIndex < 0 || !this.results[this.activeIndex]) {
      return;
    }
    const xml = this.results[this.activeIndex].mods;
    this.dialogRef.close({ mods: xml });
  }

  onCreate() {
    const xml = this.results[this.activeIndex].mods;
    this.dialogRef.close({ mods: xml, pid: this.pid, model: this.model });
  }

}

