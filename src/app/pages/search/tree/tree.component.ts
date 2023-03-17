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

  tree2: Tree;

  isReady: boolean;

  constructor(public properties: LocalStorageService,
    private api: ApiService,
    public search: SearchService) {
  }

  ngOnInit() {
    // this.initTree();
    // if (this.tree && this.tree.item && this.expandedPath && this.expandedPath.includes(this.tree.item.pid)) {
    //   this.tree.expand(this.api, false);
    //   setTimeout(() => {
    //     this.selectFromTree(this.tree);
    //   }, 1000);
    // }
  }

  ngOnChanges(c: any) {
    if (this.tree && this.tree.item && this.expandedPath && this.expandedPath.includes(this.tree.item.pid)) {
      this.tree.expand(this.api, false, (c: any) => {
        if (this.tree.item.pid === this.expandedPath[0]) {
          //setTimeout(() => {
            this.selectFromTree(this.tree);
          //}, 1000);
        }
      });

    }
  }

  // initTree() {
  //   this.isReady = false;
  //   this.tree = null;
  //   if (this.expandedPath) {
  //     if (this.expandedPath.length === 0) {
  //       this.selectedPid = this.tree.item.pid;
  //     } else {
  //       //this.selectedPid = this.expandedPath[this.expandedPath.length - 1];
  //       this.selectedPid = this.expandedPath[0];
  //     }
  //   }
  //   this.tree = new Tree(this.inputTree.item);
  //   const path: string[] = JSON.parse(JSON.stringify(this.expandedPath)).reverse();
  //   const pid = path.shift();
  //   if (pid) {
  //     this.getChildren(this.tree, path);
  //   } else {
  //     this.isReady = true;
  //   }
  // }

  getChildren(tree: Tree, path: string[]) {
    tree.children = [];
    tree.expanded = this.expandedPath.includes(tree.item.pid);
    this.api.getRelations(tree.item.pid).subscribe((children: DocumentItem[]) => {
      for (const child of children) {
        const childTree = new Tree(child, tree, tree.level + 1);
        tree.children.push(childTree);
      }
      const pid = path.shift();
      if (pid) {
        const child = tree.children.find(ch => ch.item.pid === pid);
        if (child) {
          this.getChildren(child, path);
        }
      } else {
        this.selectFromTree(tree);
        this.isReady = true;
      }
    });
  }

  select() {
    if (this.tree.expandable()) {
      this.tree.expand(this.api, false, () => {
        // this.expandedPath.includes(this.tree.item.pid)
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
    
    this.search.selectedTreePid = this.tree.item.pid;
    this.onSelect.emit(tree);
  }

}
