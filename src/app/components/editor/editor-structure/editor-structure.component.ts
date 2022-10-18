
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RepositoryService } from 'src/app/services/repository.service';

@Component({
  selector: 'app-editor-structure',
  templateUrl: './editor-structure.component.html',
  styleUrls: ['./editor-structure.component.scss']
})
export class EditorStructureComponent implements OnInit {

  @Input() items: DocumentItem[];
  @ViewChild('table') table: MatTable<DocumentItem>;

  lastClickIdx: number = -1;
  rows: DocumentItem[] = [];
  
  source: any;
  sourceNext: any;
  dragEnabled = true;
  sourceIndex: number;
  isDragging = false;

  public selectedColumns = [
    { field: 'label', selected: true },
    { field: 'model', selected: true },
    { field: 'pid', selected: false },
    { field: 'owner', selected: false },
    { field: 'created', selected: false },
    { field: 'modified', selected: true },
    { field: 'status', selected: false }
  ];
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(
    private properties: LocalStorageService,
    private repo: RepositoryService) { }

  ngOnInit(): void {
    this.initSelectedColumns();
    this.setColumns();
  }

  ngOnChanges(e: any) {
    if (this.items) {
      this.dataSource = new MatTableDataSource(this.items);
      // this.rows = JSON.parse(JSON.stringify(this.items));
    }
    
  }

  initSelectedColumns() {
    const prop = this.properties.getStringProperty('selectedColumns');
    if (prop) {
      this.selectedColumns = JSON.parse(prop);
    }
  }

  setColumns() {
    this.displayedColumns = this.selectedColumns.filter(c => c.selected).map(c => c.field)
  }

  rowClick(row: DocumentItem, idx: number, event: MouseEvent) {
    if(event && (event.metaKey || event.ctrlKey)) {
      row.selected = !row.selected;
      this.repo.setSelection(); 
    } else if(event && event.shiftKey) {
      if (this.lastClickIdx > -1) {
        const from = Math.min(this.lastClickIdx, idx);
        const to =  Math.max(this.lastClickIdx, idx);
        for (let i = from; i<=to; i++) {
          this.items[i].selected = true;
        }
        this.repo.setSelection(); 
      } else {
        // nic neni.
        this.repo.selectOne(row); 
      }
      
    } else {
      this.repo.selectOne(row)
    }
    this.lastClickIdx = idx;
  }

  open(item: DocumentItem) {
    console.log(item.pid)
    this.repo.goToObject(item);
  }

  // Drag events

  private getIndex(el: any) {
    return Array.prototype.indexOf.call(el.parentNode.childNodes, el);
  }

  private isbefore(a: any, b: any) {
    if (a.parentNode === b.parentNode) {
      for (let cur = a; cur; cur = cur.previousSibling) {
        if (cur === b) {
          return true;
        }
      }
    }
    return false;
  }
  mousedown(event: any) {
    this.dragEnabled = true;
  }

  dragstart(item: DocumentItem, idx: number, event: any) {
    if (!this.dragEnabled) {
      return;
    }
    const isMultiple = this.repo.getNumOfSelected() > 1; 
    this.source = event.currentTarget;
    this.sourceNext = event.currentTarget.nextSibling;
    this.sourceIndex = idx;
    if (isMultiple && !item.selected) {
      this.dragEnabled = false;
      event.preventDefault();
      return;
    }
    if (!isMultiple) {
      this.rowClick(item, idx, null);
    }
    this.isDragging = true;
    event.dataTransfer.effectAllowed = 'move';
  }

  dragenter(event: any) {
    if (!this.dragEnabled || this.source.parentNode !== event.currentTarget.parentNode) {
      return;
    }
    const target = event.currentTarget;
    if (this.isbefore(this.source, target)) {
      target.parentNode.insertBefore(this.source, target); // insert before
    } else {
      target.parentNode.insertBefore(this.source, target.nextSibling); // insert after
    }
  }

  dragover(event: any) {
    event.preventDefault();
  }


  dragend(event: any) {
    this.isDragging = false;
    if (!this.dragEnabled) {
      return;
    }
    const isMultiple = this.repo.getNumOfSelected() > 1; 
    const targetIndex = this.getIndex(this.source);
    let to = targetIndex;
    this.source.parentNode.insertBefore(this.source, this.sourceNext);
    if (isMultiple) {
      const movedItems = [];
      let shift = 0;
      for (let i = this.items.length - 1; i >= 0; i--) {
        if (this.items[i].selected) {
          const item = this.items.splice(i, 1);
          movedItems.push(item[0]);
          if (i < to) {
            shift += 1;
          }
        }
      }
      if (shift > 1) {
        to = to - shift + 1;
      }
      const rest = this.items.splice(to, this.items.length - to);
      for (let i = movedItems.length - 1; i >= 0; i--) {
        this.items.push(movedItems[i]);
      }
      for (let i = 0; i < rest.length; i++) {
        const item = rest[i];
        this.items.push(item);
      }
      this.repo.setIsDirty(this as Component);
      this.table.renderRows();
    } else {
      const from = this.sourceIndex;
      console.log(from, to);
      if (from !== to) {
        this.reorder(from, to);
      }
    }
  }

  reorderMultiple(to: number) {
    const movedItems = [];
    let shift = 0;
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].selected) {
        const item = this.items.splice(i, 1);
        movedItems.push(item[0]);
        if (i < to) {
          shift += 1;
        }
      }
    }
    if (shift > 1) {
      to = to - shift + 1;
    }
    const rest = this.items.splice(to, this.items.length - to);
    for (let i = movedItems.length - 1; i >= 0; i--) {
      this.items.push(movedItems[i]);
    }
    for (let i = 0; i < rest.length; i++) {
      const item = rest[i];
      this.items.push(item);
    }
    this.repo.setIsDirty(this as Component);
    this.table.renderRows();
  }

  reorder(from: number, to: number) {
    if (this.repo.getNumOfSelected() > 1) {
      this.reorderMultiple(to+1);
    } else {
      this.repo.setIsDirty(this as Component);
      const item = this.items[from];
      this.items.splice(from, 1);
      this.items.splice(to, 0, item);
    }
    this.table.renderRows();
  }

}
