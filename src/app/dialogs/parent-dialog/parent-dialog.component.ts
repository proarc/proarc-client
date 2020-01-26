
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { Catalogue } from 'src/app/model/catalogue.model';
import { CatalogueEntry } from 'src/app/model/catalogueEntry.model';
import { EditorService } from 'src/app/services/editor.service';
import { ProArc } from 'src/app/utils/proarc';
import { DocumentItem } from 'src/app/model/documentItem.model';

@Component({
  selector: 'app-catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.scss']
})
export class ParentDialogComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];
  selectedItem: DocumentItem;
  models = ProArc.models;

  model = 'model:ndkperiodical';
  query = '';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    private api: ApiService) { }

  ngOnInit() {
    this.reload();
  }

  reload(page: number = 0) {
    this.selectedItem = null;
    this.pageIndex = page;
    this.state = 'loading';
    this.api.getSearchResults(this.model, this.query, this.pageIndex).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      this.state = 'success';
    });
  }

  onPageChanged(page) {
    this.reload(page.pageIndex);
  }

  onSave() {
    if (this.selectedItem) {
      return;
    }
    this.dialogRef.close({pid: this.selectedItem.pid});
  }

}

