import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ViewerComponent } from '../../components/viewer/viewer.component';
import { DocumentItem } from '../../model/documentItem.model';
import { ResizecolDirective } from '../../resizecol.directive';
import { ResizedDirective, ResizedEvent } from '../../resized.directive';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, AngularSplitModule, FlexLayoutModule,
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatPaginatorModule,
    MatCheckboxModule,
    MatTableModule, MatSortModule, ResizecolDirective, ResizedDirective, MatDialogModule, ViewerComponent],
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
  meta: any;

  pageType: boolean = true;
  pageIndex: boolean = true;
  pageNumber: boolean = true;
  pagePosition: boolean = true;
  reprePage: boolean = false;
  lastClickIdx: { [key: string]: number } = { orig: -1, dest: -1 };
  lastClickIdxDest: number = -1;
  lastSelectedItemPid: string;
  changed = false;

  maxIconWidth: any = { orig: 91, dest: 91 };
  rectSize: any = {};

  // název souboru, typ strany, číslo, index +přidat: pozice
  displayedColumns: string[] = ['filename', 'pageType', 'pageNumber', 'pageIndex', 'pagePosition']; // 

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<MarkSequenceDialogComponent>,
    private layout: LayoutService,
    public settings: UserSettings,
    private settingsService: UserSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initLists();
    this.lastSelectedItemPid = this.layout.lastSelectedItem().pid;
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
    const lastSelected = this.layout.lastSelectedItem().pid;
    this.layout.items().forEach(item => {
      if (item.selected) {
        selection.push(item.pid);
      }
    });
    this.layout.setItems([]);
    this.data.items = [];
    this.api.getBatchPages(this.layout.batchId).subscribe((response: any) => {

      if (response['response'].status === -1) {
        this.ui.showErrorSnackBar(response['response'].data);
        // this.router.navigate(['/import/history']);
        return;
      }

      const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
      this.layout.setItems(pages);
      for (let i = 0; i < this.layout.items().length; i++) {
        const item = this.layout.items()[i];
        if (selection.includes(item.pid)) {
          item.selected = true;
        }
        if (item.pid === lastSelected) {
          this.layout.setLastSelectedItem(item);
        }
      }
      this.data.items = pages;
      this.initLists();
    });
  }


  // resizable columns
  // orig table
  setColumnsOrigTable() {
  }

  initSelectedColumnsOrigTable() {
    this.displayedColumns = this.settings.markSequenceDialogOrigTableColumns.filter(c => c.selected).map(c => c.field);
  }

  getColumnWidthOrigTable(field: string) {
    const el = this.settings.markSequenceDialogOrigTableColumns.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesOrigTable(e: any, field?: string) {
    const el = this.settings.markSequenceDialogOrigTableColumns.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.settingsService.save();
  }

  // dest table
  initSelectedColumnsDestTable() {
    this.data.displayedColumns = this.settings.markSequenceDialogDestTableColumns.filter(c => c.selected).map(c => c.field);
  }

  getColumnWidthDestTable(field: string) {
    const el = this.settings.markSequenceDialogDestTableColumns.find((c: any)=> c.field === field);
    if (el) {
      return el.width + 'px';
    } else {
      return '';
    }
  }

  saveColumnsSizesDestTable(e: any, field?: string) {
    const el = this.settings.markSequenceDialogDestTableColumns.find((c: any)=> c.field === field);
    if (el) {
      el.width = e;
    } else {
      console.log("nemelo by")
    } 
    this.settingsService.save();
  }
  // end

}
