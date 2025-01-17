import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Catalogue } from '../../model/catalogue.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule,
    MatSelectModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule
  ],
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
        //this.ui.showErrorDialogFromObject(response['response'].errors[0]);
        this.state = 'error';
        this.message = response['response'].errors[0].errorMessage;
        return;
      }
      this.message = String(this.translator.instant('dialog.updateInSource.alert.success'));
      this.state = 'success';
    });

  }

}
