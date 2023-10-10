import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Catalogue } from 'src/app/model/catalogue.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-update-in-source-dialog',
  templateUrl: './update-in-source-dialog.component.html',
  styleUrls: ['./update-in-source-dialog.component.scss']
})
export class UpdateInSourceDialogComponent implements OnInit {

  state: string;
  message: string;
  catalogs: Catalogue[];
  selectedCatalogue: Catalogue;

  constructor(
    public dialogRef: MatDialogRef<UpdateInSourceDialogComponent>,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    private translator: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    this.state = 'saving';
    this.api.getCatalogsForUpdate().subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('updateInSource error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.updateInSource.alert.error'));
        return;
      }
      this.catalogs = Catalogue.fromJsonArray(response['response']['data']);
      this.selectedCatalogue = this.catalogs[0];
      this.state = 'none';
    });
  }

  update() {
    this.state = 'saving';
    this.api.updateInSource(this.data, this.selectedCatalogue.id).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('updateInSource error', response['response'].errors);
        // this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        this.message = String(this.translator.instant('dialog.updateInSource.alert.error'));
        return;
      }
      this.message = String(this.translator.instant('dialog.updateInSource.alert.success'));
      this.state = 'success';
    });

  }

}
