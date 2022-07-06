import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Catalogue, CatalogueField } from 'src/app/model/catalogue.model';
import { CatalogueEntry } from 'src/app/model/catalogueEntry.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-new-workflow-dialog',
  templateUrl: './new-workflow-dialog.component.html',
  styleUrls: ['./new-workflow-dialog.component.scss']
})
export class NewWorkflowDialogComponent implements OnInit {

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
    public dialogRef: MatDialogRef<NewWorkflowDialogComponent>,
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
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      const pid = response['response']['data'][0]['pid'];
      this.state = 'success';
      this.dialogRef.close('ok');
    });
  }

}
