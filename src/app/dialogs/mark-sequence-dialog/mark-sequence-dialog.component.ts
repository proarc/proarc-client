import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ResizedEvent } from 'angular-resize-event';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-mark-sequence-dialog',
  templateUrl: './mark-sequence-dialog.component.html',
  styleUrls: ['./mark-sequence-dialog.component.scss']
})
export class MarkSequenceDialogComponent implements OnInit {

  showOrig = true;
  orig: any[] = [];
  dest: any[] = [];
  origTable: any;
  destTable: any;
  // origViewMode = 'icons';
  // destViewMode = 'icons';
  meta: any;

  pageType: boolean = true;
  pageIndex: boolean = true;
  pageNumber: boolean = true;
  pagePosition: boolean = true;
  reprePage: boolean = true;
  lastClickIdx: { [key: string]: number } = { orig: -1, dest: -1 };
  lastClickIdxDest: number = -1;
  lastSelectedItemPid: string;
  changed = false;

  maxIconWidth: any = { orig: 91, dest: 91 };
  rectSize: any = {};

  public selectedColumnsOrigTable = [
    { field: 'filename', selected: true, width: 100 },
    { field: 'pageType', selected: true, width: 100 },
    { field: 'pageNumber', selected: true, width: 100 },
    { field: 'pageIndex', selected: true, width: 100 },
    { field: 'pagePosition', selected: true, width: 100 }
  ];

  public selectedColumnsDestTable = [
    { field: 'pid', selected: false, width: 100 },
    { field: 'label', selected: false, width: 100 },
    { field: 'filename', selected: true, width: 100 },
    { field: 'pageType', selected: true, width: 100 },
    { field: 'pageIndex', selected: true, width: 100 },
    { field: 'pageNumber', selected: true, width: 100 },
    { field: 'pagePosition', selected: true, width: 100 },    
    { field: 'model', selected: false, width: 100 },
    { field: 'owner', selected: false, width: 100 },
    { field: 'created', selected: false, width: 100 },
    { field: 'modified', selected: false, width: 100 },
    { field: 'status', selected: false, width: 100 }
  ];

  // název souboru, typ strany, číslo, index +přidat: pozice
  displayedColumns: string[] = ['filename', 'pageType', 'pageNumber', 'pageIndex', 'pagePosition']; // 

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<MarkSequenceDialogComponent>,
    private layout: LayoutService,
    public properties: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initLists();
    this.lastSelectedItemPid = this.layout.lastSelectedItem.pid;
    this.initSelectedColumnsOrigTable();
    this.initSelectedColumnsDestTable();
  }

  initLists() {
    this.orig = this.data.items;
    this.dest = [];
    this.data.items.forEach((item: DocumentItem) => {
      //this.orig.push(JSON.parse(JSON.stringify(item)));
      const di = JSON.parse(JSON.stringify(item));
      di.selectedInOrig = item.selected;
      di.selected = false;
      this.dest.push(di);
      // this.dest.forEach(i => i.selected = false);
      this.origTable = new MatTableDataSource(this.orig);
      this.destTable = new MatTableDataSource(this.dest);

    });
  }

  onResized(event: ResizedEvent, panel: string) {
    this.rectSize[panel] = event.newRect.width;
    this.resize(panel);
  }

  resize(panel: string) {
    const d = this.rectSize[panel] / this.maxIconWidth[panel];
    const iconColumns = Math.floor(d);
    this.data.iconHeight[panel] = ((this.rectSize[panel] - 4.0) / iconColumns) * 1.47;
    this.data.iconWidth[panel] = 100.0 / iconColumns;
  }

  zoomIn(panel: string) {
    this.maxIconWidth[panel] = Math.floor(this.maxIconWidth[panel] * 1.2);
    this.resize(panel);
  }

  zoomOut(panel: string) {
    this.maxIconWidth[panel] = Math.floor(this.maxIconWidth[panel] * .8);
    this.resize(panel);
  }

  thumb(pid: string) {
    if (this.data.iconHeight['dest'] > 150) {
      return this.data.api.getStreamUrl(pid, 'PREVIEW', this.data.batchId);
    } else {
      return this.data.api.getStreamUrl(pid, 'THUMBNAIL', this.data.batchId);
    }

  }

  select(array: any[], item: DocumentItem, idx: number, event: MouseEvent, col: string) {
    if (event && (event.metaKey || event.ctrlKey)) {
      // Nesmi byt prazdna selecke pro import
      item.selected = !item.selected;
    } else if (event && event.shiftKey) {
      if (this.lastClickIdx[col] > -1) {
        const from = Math.min(this.lastClickIdx[col], idx);
        const to = Math.max(this.lastClickIdx[col], idx);
        for (let i = from; i <= to; i++) {
          array[i].selected = true;
        }
      } else {
        // nic neni.
        array.forEach(i => i.selected = false);
        item.selected = true;
      }

    } else {
      array.forEach(i => i.selected = false);
      item.selected = true;
    }
    this.lastClickIdx[col] = idx;
    this.lastSelectedItemPid = item.pid;
  }

  markSequence() {

    this.dest.forEach((item: DocumentItem, idx: number) => {
      this.data.items[idx].selected = item.selected;
    });
    this.initLists();
  }

  save() {
    const data = {
      sourcePids: this.orig.filter(i => i.selected).map(i => i.pid),
      destinationPids: this.dest.filter(i => i.selected).map(i => i.pid),
      copyPageIndex: this.pageIndex,
      copyPageNumber: this.pageNumber,
      copyPageType: this.pageType,
      copyPagePosition: this.pagePosition,
      copyReprePage: this.reprePage,
      batchId: this.data.batchId
    }
    this.api.saveMarkSequence(data).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
      } else {
        // this.dialogRef.close(this.changed);
        this.ui.showInfo('editor.children.markSequenceSaved')
        this.changed = true;
      }
      this.refreshPages();
    })
  }

  refreshPages() {
    const selection: string[] = [];
    const lastSelected = this.layout.lastSelectedItem.pid;
    this.layout.items.forEach(item => {
      if (item.selected) {
        selection.push(item.pid);
      }
    });
    this.layout.items = [];
    this.data.items = [];
    this.api.getBatchPages(this.layout.getBatchId()).subscribe((response: any) => {

      if (response['response'].status === -1) {
        this.ui.showErrorSnackBar(response['response'].data);
        // this.router.navigate(['/import/history']);
        return;
      }

      const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
      console.log(pages, selection, lastSelected)
      this.layout.items = pages;
      for (let i = 0; i < this.layout.items.length; i++) {
        const item = this.layout.items[i];
        if (selection.includes(item.pid)) {
          item.selected = true;
        }
        if (item.pid === lastSelected) {
          this.layout.lastSelectedItem = item;
        }
      }
      this.data.items = pages;
      this.initLists();
    });
  }


  // resizable columns
  // orig table
  setColumnsOrigTable() {
    this.displayedColumns = this.selectedColumnsOrigTable.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumnsOrigTable() {
    const prop = this.properties.getStringProperty('markSequenceDialogOrigTableColumns');
    if (prop) {
      Object.assign(this.selectedColumnsOrigTable, JSON.parse(prop));
    }
    this.setColumnsOrigTable();
  }

  getColumnWidthOrigTable(field: string) {
    const el = this.selectedColumnsOrigTable.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesOrigTable(e: any, field?: string) {
    const el = this.selectedColumnsOrigTable.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.properties.setStringProperty('markSequenceDialogOrigTableColumns', JSON.stringify(this.selectedColumnsOrigTable));
  }

  // dest table
  setColumnsDestTable() {
    this.data.displayedColumns = this.selectedColumnsDestTable.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumnsDestTable() {
    const prop = this.properties.getStringProperty('markSequenceDialogDestTableColumns');
    if (prop) {
      Object.assign(this.selectedColumnsDestTable, JSON.parse(prop));
    }
    this.setColumnsDestTable();
  }

  getColumnWidthDestTable(field: string) {
    const el = this.selectedColumnsDestTable.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesDestTable(e: any, field?: string) {
    const el = this.selectedColumnsDestTable.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.properties.setStringProperty('markSequenceDialogDestTableColumns', JSON.stringify(this.selectedColumnsDestTable));
  }
  // end

}
