import { Component, OnInit } from '@angular/core';

export interface IConfig {
  columns: Array<{
    visible: boolean
    size: number
    rows: Array<{
      visible: boolean
      size: number
      type: string
    }>
  }>
  disabled: boolean
}

export const defaultLayoutConfig: IConfig = {
  columns: [
    {
      visible: true,
      size: 33,
      rows: [
        { visible: true, size: 25, type: 'structure' },
        { visible: true, size: 75, type: 'metadata' },
      ],
    },
    {
      visible: true,
      size: 33,
      rows: [
        { visible: true, size: 60, type: 'atm' },
        { visible: true, size: 40, type: 'image' },
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

  types = ['structure', 'metadata', 'mods', 'image', 'atm', 'ocr', 'comment'];

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem(this.localStorageName)) {
      this.config = JSON.parse(localStorage.getItem(this.localStorageName))
    } else {
      this.resetConfig()
    }
  }

  resetConfig() {
    this.config = JSON.parse(JSON.stringify(defaultLayoutConfig));
    localStorage.removeItem(this.localStorageName)
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
    this.config.disabled = !this.config.disabled

    this.saveLocalStorage()
  }

  refreshColumnVisibility() {
    // Refresh columns visibility based on inside rows visibilities (If no row > hide column)
    this.config.columns.forEach((column, index) => {
      column.visible = column.rows.some((row) => row.visible === true)
    })

    this.saveLocalStorage()
  }

  saveLocalStorage() {
    localStorage.setItem(this.localStorageName, JSON.stringify(this.config))
  }

}
