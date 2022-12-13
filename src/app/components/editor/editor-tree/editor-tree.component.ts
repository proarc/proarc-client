import { Component, Input, OnInit } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-tree',
  templateUrl: './editor-tree.component.html',
  styleUrls: ['./editor-tree.component.scss']
})
export class EditorTreeComponent implements OnInit {

  // @Input() item: DocumentItem;

  isSelected = false;
  selectedPid: string;
  selectedParentPid: string;

  constructor(public layout: LayoutService) { }

  ngOnInit(): void {
    this.selectedPid = this.layout.expandedPath[this.layout.expandedPath.length - 1];
    this.selectedParentPid = this.layout.expandedPath[0];

    this.layout.tree = new Tree(this.layout.rootItem);
  }

  openFromTree(item: DocumentItem) {
    console.log('selected:', item.pid)
    // this.router.navigate(['/repository', item.pid]);
  }

  selectFromTree(tree: Tree) {

    this.layout.clearSelection();
    this.layout.lastSelectedItem = tree.item;
    if (tree.children) {
      this.layout.selectedParentItem = tree.item;
      this.layout.items = tree.children.map(ch => ch.item);
      this.layout.clearSelection();
    } else {

      if (this.layout.selectedParentItem.pid !== tree.parent.item.pid || !this.isSelected) {
        this.layout.selectedParentItem = tree.parent.item;
        if (tree.parent.children) {
          this.layout.items = tree.parent.children.map(ch => ch.item);
          this.layout.clearSelection();
        }
      }
      this.layout.items.forEach(i => {
        i.selected = i.pid === tree.item.pid;
      });

      if (tree.expandable()) {
        this.layout.items = [];
      }

    }
    //tree.item.selected = true;
    this.layout.expandedPath = [];
    let p = tree;
    this.layout.expandedPath.unshift(p.item.pid);
    while (p.parent) {
      p = p.parent;
      this.layout.expandedPath.unshift(p.item.pid);
    }
    this.isSelected = true;
    this.layout.setSelection(true, true);

  }

}
