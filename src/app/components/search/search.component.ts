import { DocumentItem } from '../../model/documentItem.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ProArc } from 'src/app/utils/proarc';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Translator } from 'angular-translator';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { ExportDialogComponent } from 'src/app/dialogs/export-dialog/export-dialog.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];

  models = ProArc.models;

  model: string;
  query = '';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  constructor(private api: ApiService, 
              private properties: LocalStorageService, 
              private dialog: MatDialog,
              private translator: Translator) { 
  }

  ngOnInit() {
    this.model = this.properties.getStringProperty('search.model', ProArc.defaultModel);
    if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      this.reload();
    } else {
      this.state = 'success';
    }
  }

  reload(page: number = 0) {
    this.properties.setStringProperty('search.model', this.model);
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


}
