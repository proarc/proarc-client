import { DocumentItem } from '../../model/documentItem.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Translator } from 'angular-translator';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { ExportDialogComponent } from 'src/app/dialogs/export-dialog/export-dialog.component';
import { UrnbnbDialogComponent } from 'src/app/dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];

  models: string[]

  model: string;
  query = '';
  queryFiled: string;

  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  sortField: string;
  sortAsc: boolean;

  constructor(private api: ApiService, 
              public properties: LocalStorageService, 
              private dialog: MatDialog,
              private config: ConfigService,
              private translator: Translator) { 
                this.models = this.config.allModels;
  }

  ngOnInit() {
    this.sortField = this.properties.getStringProperty('search.sortfield', 'lastCreated');
    this.sortAsc = this.properties.getBoolProperty('search.sortasc', false);
    this.model = this.properties.getStringProperty('search.model', this.config.defaultModel);
    this.queryFiled = this.properties.getStringProperty('search.qyeryfiled', 'queryTitle');
    if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      this.reload();
    } else {
      this.state = 'success';
    }
  }

  reload(page: number = 0) {
    this.properties.setStringProperty('search.model', this.model);
    this.properties.setStringProperty('search.qyeryfiled', this.queryFiled);
    this.pageIndex = page;
    this.state = 'loading';
    this.api.getSearchResults(this.model, this.query, this.queryFiled, this.pageIndex, this.sortField, this.sortAsc).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      this.state = 'success';
    });
  }

  onPageChanged(page) {
    this.reload(page.pageIndex);
  }

  onUrnnbn(item: DocumentItem) {
    const dialogRef = this.dialog.open(UrnbnbDialogComponent, { data: item.pid });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
    
      }
    });
  }

  onExport(item: DocumentItem) {
    const dialogRef = this.dialog.open(ExportDialogComponent, { data: item.pid });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        
      }
    });
  }

  onDelete(item: DocumentItem) {
    const checkbox = {
      label: String(this.translator.instant('editor.children.delete_dialog.permanently')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.delete_dialog.title')),
      message: String(this.translator.instant('editor.children.delete_dialog.message')),
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      checkbox: checkbox
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteObject(item, checkbox.checked);
      }
    });
  }

  private deleteObject(item: DocumentItem, pernamently: boolean) {
    this.state = 'loading';
    this.api.deleteObjects([item.pid], pernamently).subscribe((removedPid: string[]) => {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (removedPid.indexOf(this.items[i].pid) > -1) {
                this.items.splice(i, 1);
            }
        }
        this.state = 'success';
    });
  }





  getSortIcon(field: string) {
    if (this.query) {
      return;
    }
    if (this.sortField === field) {
      if (this.sortAsc) {
        return 'arrow_drop_up';
      } else {
        return 'arrow_drop_down';
      }
    }
  }

  sortBy(field: string) {
    if (this.query) {
      return;
    }
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortAsc = false;
    }
    this.sortField = field;
    this.properties.setStringProperty('search.sortfield', this.sortField);
    this.properties.setBoolProperty('search.sortasc', this.sortAsc);
    this.reload();
  }


}
