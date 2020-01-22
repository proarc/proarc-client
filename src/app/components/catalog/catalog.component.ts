import { CatalogueEntry } from './../../model/catalogueEntry.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Catalogue } from 'src/app/model/catalogue.model';
import { MatDialog } from '@angular/material';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  state = 'none';
  catalogs: Catalogue[];

  activeCatalog: Catalogue;
  activeField: string;
  activeQuery: string;

  activeIndex = -1;
  results: CatalogueEntry[];
  message: string;

  constructor(private api: ApiService, 
              private translator: Translator,
              private dialog: MatDialog) { }

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
    console.log(this.activeCatalog.id + ', ' + this.activeField + ', ' + this.activeQuery);
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
      this.onCatalogSearchError();
    }
    );
  }

  onCatalogSearchError() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('catalog.dialog_search_failed.title')),
      message: String(this.translator.instant('catalog.dialog_search_failed.message')),
      btn1: {
        label: String(this.translator.instant('common.ok')),
        value: 'ok',
        color: 'default'
      }
    };
    this.dialog.open(SimpleDialogComponent, { data: data });
    this.state = 'success';
  }

}
