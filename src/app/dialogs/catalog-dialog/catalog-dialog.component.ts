
import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Catalogue, CatalogueField } from '../../model/catalogue.model';
import { CatalogueEntry } from '../../model/catalogueEntry.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatTableModule, MatProgressBarModule, MatSelectModule, MatRadioModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule,
    FormsModule, MatFormFieldModule, MatCheckboxModule
  ],
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
    private config: Configuration,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.state = 'loading';
    this.models = this.config.models;
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
    this.dialogRef.close({ mods: xml, catalogId: this.activeCatalog.id });
  }

  onCreate() {
    const xml = this.results[this.activeIndex].mods;
    this.dialogRef.close({ mods: xml, pid: this.pid, model: this.model, catalogId: this.activeCatalog.id });
  }

}

