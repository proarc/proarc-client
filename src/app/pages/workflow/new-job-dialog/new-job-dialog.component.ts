import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Catalogue, CatalogueField } from '../../../model/catalogue.model';
import { CatalogueEntry } from '../../../model/catalogueEntry.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
@Component({
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule, MatDividerModule,
    MatRadioModule, MatFormFieldModule, MatSelectModule, MatCardModule
  ],
  selector: 'app-new-job-dialog',
  templateUrl: './new-job-dialog.component.html',
  styleUrls: ['./new-job-dialog.component.scss']
})
export class NewJobDialogComponent implements OnInit {

  selectedProfile: any;

  catalogues: Catalogue[];
  selectedCatalogue: Catalogue;
  activeField: CatalogueField;

  activeQuery: string;
  results: CatalogueEntry[];
  activeIndex = -1;

  state: string;
  message: string;

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<NewJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { profiles: any }) { }

  ngOnInit(): void {
    this.selectedProfile = this.data.profiles[0];
    this.api.getCatalogs().subscribe((c: Catalogue[]) => {
      this.catalogues = c;
    })
  }

  search() {

    this.state = 'loading';
    this.api.getCatalogSearchResults('', this.selectedCatalogue.id, this.activeField.id, this.activeQuery).subscribe((response: any) => {
      this.results = CatalogueEntry.fromJsonArray(response['metadataCatalogEntries']['entry']);
      if (this.results.length > 0) {
        this.activeIndex = 0;
      } else {
        this.message = 'no-results';
      }
      this.state = 'success';
    });
  }

  selectEntry(index: number) {
    if (this.state === 'saving') {
      return;
    }
    this.activeIndex = index;
  }

  save() {
    let data = `profileName=${this.selectedProfile.name}`;
    data = `${data}&metadata=${encodeURIComponent(this.results[this.activeIndex].mods)}`;
    this.api.createWorkflow(data).subscribe((response: any) => {
      console.log(response)
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      const pid = response['response']['data'][0]['pid'];
      this.state = 'success';
      this.dialogRef.close('ok');
    });
  }

}
