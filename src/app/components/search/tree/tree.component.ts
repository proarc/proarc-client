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
  @Input('inPanel') inPanel: boolean;
  @Input('expanded') expanded: boolean;
  @Input('expandedPath') expandedPath: string[];
  @Input() selectedPid: string;
  @Input() selectedParentPid: string;
  @Output() onSelect = new EventEmitter<Tree>();
  @Output() onOpen = new EventEmitter<DocumentItem>();

  constructor(public properties: LocalStorageService,
    private api: ApiService,
    public search: SearchService) {
  }

  ngOnInit() {
    if (this.tree && this.expanded) {
      this.tree.expand(this.api, false);
    }
  }

  ngOnChanges(c: any) {
    if (this.tree && this.tree.item && this.expandedPath && this.expandedPath.includes(this.tree.item.pid)) {
      this.tree.expand(this.api, false);
    }
  }

  select() {
    this.search.selectedTreePid = this.tree.item.pid;
    if (this.tree.expandable()) {
      this.tree.expand(this.api, false, () => {
        this.expandedPath.includes(this.tree.item.pid)
        this.selectFromTree(this.tree);
      });
    }
    this.selectFromTree(this.tree);
  }

  toggle(event: any) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.tree.expanded) {
      this.tree.expand(this.api, false);
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

  selectFromTree(tree: Tree) {
    this.onSelect.emit(tree);
  }

}
