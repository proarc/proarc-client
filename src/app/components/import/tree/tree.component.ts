import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ImportService } from 'src/app/services/import.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SearchService } from 'src/app/services/search.service';
import { ImportTree } from './tree.model';

@Component({
  selector: 'app-import-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class ImportTreeComponent implements OnInit {

  @Input('tree') tree: ImportTree;

  constructor(public properties: LocalStorageService, 
    private api: ApiService,
    private importService: ImportService,
    public search: SearchService) { 
  }

  ngOnInit() {

  }

  toggle() {
    if (!this.tree.expanded) {
      this.tree.expand(this.api);
    } else {
      this.tree.expanded = false;
    }
  }

  onClick() {
    if (this.tree.expandable()) {
      if (!this.tree.expanded) {
        this.tree.expand(this.api);
      } else {
        this.tree.expanded = false;
      }
    } else if (this.tree.selectable()) {
      this.importService.toggleFoder(this.tree.folder);
    }
  }

}
