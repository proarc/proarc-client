import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export const localStorageName = 'proarc-layout';

export interface ILayoutPanel {
    id: string,
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
        { id: 'panel1', visible: true, size: 25, type: 'structure-list' },
        { id: 'panel2', visible: true, size: 75, type: 'metadata' },
      ],
    },
    {
      visible: true,
      size: -1,
      rows: [
        { id: 'panel3', visible: true, size: 20, type: 'mods' },
        { id: 'panel4', visible: false, size: 30, type: 'ocr' },
        { id: 'panel5', visible: false, size: 50, type: 'comment' },
      ],
    },
    {
      visible: true,
      size: 33,
      rows: [
        { id: 'panel6', visible: true, size: 40, type: 'image' },
        { id: 'panel7', visible: true, size: 60, type: 'atm' },
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

  
  config: IConfig = null;

  types = ['structure-list', 'structure-grid', 'structure-icons', 'metadata', 'mods', 'atm', 'ocr', 'comment', 'image', 'pdf']; //,'tree'
  

  constructor(public dialogRef: MatDialogRef<LayoutAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {layout: string}) { }

  ngOnInit() {
    if (!this.data.layout) {
      this.data.layout = 'repo';
    }

    if (this.data.layout === 'repo') {
      this.types.unshift('tree');
    }

    let idx = 0;
    
    if (localStorage.getItem(localStorageName + '-' + this.data.layout)) {
      this.config = JSON.parse(localStorage.getItem(localStorageName + '-' + this.data.layout));
      this.config.columns.forEach(c => {
        c.rows.forEach(r => {
          if (!r.id) {
            r.id = 'panel' + idx++;
          }
        });
      });
    } else {
      this.resetConfig()
    }
  }

  resetConfig() {
    this.config = JSON.parse(JSON.stringify(defaultLayoutConfig));
    localStorage.removeItem(localStorageName + '-' + this.data.layout)
  }

  onDragEnd(columnindex: number, e: any) {
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
    if (localStorage.getItem(localStorageName + '-' + this.data.layout)) {
      this.config = JSON.parse(localStorage.getItem(localStorageName + '-' + this.data.layout))
    } else {
      this.resetConfig()
    }
  }

  saveLocalStorage() {
    localStorage.setItem(localStorageName + '-' + this.data.layout, JSON.stringify(this.config))
  }

}
