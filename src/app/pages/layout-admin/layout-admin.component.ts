import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ILayoutPanel {
    visible: boolean,
    isEmpty?: boolean,
    size: number,
    type: string
  }

export interface IConfig {
  columns: Array<{
    visible: boolean,
    size: number,
    rows: Array<ILayoutPanel>
  }>
  disabled: boolean
}

export const defaultLayoutConfig: IConfig = {
  columns: [
    {
      visible: true,
      size: 33,
      rows: [
        { visible: true, size: 25, type: 'structure-list' },
        { visible: true, size: 75, type: 'metadata' },
      ],
    },
    {
      visible: true,
      size: -1,
      rows: [
        { visible: true, size: 20, type: 'mods' },
        { visible: false, size: 30, type: 'ocr' },
        { visible: false, size: 50, type: 'comment' },
      ],
    },
    {
      visible: true,
      size: 33,
      rows: [
        { visible: true, size: 40, type: 'image' },
        { visible: true, size: 60, type: 'atm' },
      ],
    },
  ],
  disabled: false,
}

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {

  localStorageName = 'proarc-layout';
  config: IConfig = null;

  types = ['structure-list', 'structure-grid', 'structure-icons', 'metadata', 'mods', 'atm', 'ocr', 'comment', 'image'];
  

  constructor(public dialogRef: MatDialogRef<LayoutAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {layout: string}) { }

  ngOnInit() {
    if (!this.data.layout) {
      this.data.layout = 'repo';
    }
    if (localStorage.getItem(this.localStorageName + '-' + this.data.layout)) {
      this.config = JSON.parse(localStorage.getItem(this.localStorageName + '-' + this.data.layout))
    } else {
      this.resetConfig()
    }
  }

  resetConfig() {
    this.config = JSON.parse(JSON.stringify(defaultLayoutConfig));
    localStorage.removeItem(this.localStorageName + '-' + this.data.layout)
  }

  onDragEnd(columnindex: number, e: any) {
    console.log(e)
    // Column dragged
    if (columnindex === -1) {
      // Set size for all visible columns
      this.config.columns.filter((c) => c.visible === true).forEach((column, index) => (column.size = e.sizes[index]))
    }
    // Row dragged
    else {
      // Set size for all visible rows from specified column
      this.config.columns[columnindex].rows
        .filter((r) => r.visible === true)
        .forEach((row, index) => (row.size = e.sizes[index]))
    }

    this.saveLocalStorage()
  }

  toggleDisabled() {
    this.config.disabled = !this.config.disabled;
    this.saveLocalStorage()
  }

  refreshColumnVisibility() {
    // Refresh columns visibility based on inside rows visibilities (If no row > hide column)
    this.config.columns.forEach((column, index) => {
      column.visible = column.rows.some((row) => row.visible === true)
    })

    this.saveLocalStorage()
  }

  setLayoutConfig() {
    if (localStorage.getItem(this.localStorageName + '-' + this.data.layout)) {
      this.config = JSON.parse(localStorage.getItem(this.localStorageName + '-' + this.data.layout))
    } else {
      this.resetConfig()
    }
  }

  saveLocalStorage() {
    localStorage.setItem(this.localStorageName + '-' + this.data.layout, JSON.stringify(this.config))
  }

}
