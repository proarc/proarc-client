
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { ProArc } from 'src/app/utils/proarc';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-parent-dialog',
  templateUrl: './parent-dialog.component.html',
  styleUrls: ['./parent-dialog.component.scss']
})
export class ParentDialogComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];
  selectedItem: DocumentItem;
  models = ProArc.models;
  model: string;
  query = '';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    private properties: LocalStorageService, 
    private api: ApiService) { }

  ngOnInit() {
    this.model = this.properties.getStringProperty('search.model', ProArc.defaultModel);
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
    if (!this.selectedItem) {
      return;
    }
    this.dialogRef.close({pid: this.selectedItem.pid});
  }

}

