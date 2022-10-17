import { Component, OnInit, Input } from '@angular/core';
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

  lastClickIdx: number;

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

  constructor(
    private properties: LocalStorageService,
    private repo: RepositoryService) { }

  ngOnInit(): void {
    this.initSelectedColumns();
    this.setColumns();
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

  rowClick(row: DocumentItem, event: MouseEvent) {
    if(event && event.ctrlKey) {
      row.selected = !row.selected;

    } else if(event && event.shiftKey) {
      row.selected = !row.selected;

    } else {
      this.repo.selectOne(row)
    }
    
  }

}
