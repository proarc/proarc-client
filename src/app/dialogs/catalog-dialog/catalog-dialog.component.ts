
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { Catalogue } from 'src/app/model/catalogue.model';
import { CatalogueEntry } from 'src/app/model/catalogueEntry.model';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.scss']
})
export class CatalogDialogComponent implements OnInit {

  state = 'none';
  catalogs: Catalogue[];

  activeCatalog: Catalogue;
  activeField: string;
  activeQuery: string;

  activeIndex = -1;
  results: CatalogueEntry[];
  message: string;

  constructor(
    public dialogRef: MatDialogRef<CatalogDialogComponent>,
    private api: ApiService,
    private editor: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }


    ngOnInit() {
      this.state = 'loading';
      this.api.getCatalogs().subscribe((catalogs: Catalogue[]) => {
        this.onCatalogsLoaded(catalogs);
      });
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
      if (catalog.fileds.length > 0) {
        if (this.activeField && catalog.fileds.indexOf(this.activeField) > -1) {
          return;
        }
        this.activeField = catalog.fileds[0];
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
      this.api.getCatalogSearchResults(catalog, field, query).subscribe((result: CatalogueEntry[]) => {
        this.results = result;
        if (this.results.length > 0) {
          this.activeIndex = 0;
        } else {
          this.message = 'no-results';
        }
        this.state = 'success';
      },
      (error) => {
        this.message = 'search-error';
        this.state = 'success';
      }
      );
    }




  onSave() {
    if (this.activeIndex < 0 || !this.results[this.activeIndex]) {
      return;
    }
    const xml = this.results[this.activeIndex].mods;
    this.dialogRef.close({mods: xml});
  }

}

