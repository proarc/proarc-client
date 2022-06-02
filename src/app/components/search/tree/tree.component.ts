import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {


  @Input('tree') tree: Tree;
  @Output() onSelect = new EventEmitter<DocumentItem>();
  @Output() onOpen = new EventEmitter<DocumentItem>();

  constructor(public properties: LocalStorageService, 
    private router: Router,
    private api: ApiService, 
    public search: SearchService) { 
  }

  ngOnInit() {

  }

  select() {
    this.search.selectedTree = this.tree;
    this.onSelect.emit(this.tree.item);
  }

  toggle(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.tree.expanded) {
      this.tree.expand(this.api);
    } else {
      this.tree.expanded = false;
    }
  }

  open() {
    this.onOpen.emit(this.tree.item);
  }

  openFromTree(item: DocumentItem) {
    this.onOpen.emit(item);
  }

  selectFromTree(item: DocumentItem) {
    this.onSelect.emit(item);
  }

}
