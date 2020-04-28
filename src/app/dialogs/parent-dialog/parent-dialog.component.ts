
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-parent-dialog',
  templateUrl: './parent-dialog.component.html',
  styleUrls: ['./parent-dialog.component.scss']
})
export class ParentDialogComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];
  selectedItem: DocumentItem;
  models: string[];
  model: string;
  query = '';
  queryFiled: string;

  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  ingestOnly: boolean;

  hierarchy: DocumentItem[];




  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    private properties: LocalStorageService,
    private config: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService) { 
      this.ingestOnly = data && !!data.ingestOnly;
      this.models = this.config.allModels;
    }

  ngOnInit() {
    this.model = this.properties.getStringProperty('search.model', this.config.defaultModel);
    this.queryFiled = this.properties.getStringProperty('search.qyeryfiled', 'queryTitle');
    this.reload();
  }

  reload(page: number = 0) {
    this.properties.setStringProperty('search.model', this.model);
    this.properties.setStringProperty('search.qyeryfiled', this.queryFiled);
    this.hierarchy = [];
    this.selectedItem = null;
    this.pageIndex = page;
    this.state = 'loading';
    this.api.getSearchResults(this.model, this.query, this.queryFiled, this.pageIndex).subscribe(([items, total]: [DocumentItem[], number]) => {
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

  open(item: DocumentItem, index: number = -1) {
    if (item.isPage()) {
      return;
    }
    if (index > -1) {
      this.hierarchy.splice(index);
    }
    this.selectedItem = null;
    this.hierarchy.push(item);
    this.loadChildrenForPid(item.pid);
  }


  private loadChildrenForPid(pid: string) {
    this.state = 'loading';
    this.api.getRelations(pid).subscribe((children: DocumentItem[]) => {
      this.items = [];
      for (const child of children) {
        if (!child.isPage()) {
          this.items.push(child);
        }
      }
      this.state = 'success';
    });
  }



}

