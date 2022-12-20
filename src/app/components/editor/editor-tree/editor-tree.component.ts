import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SearchService } from 'src/app/services/search.service';

interface ItemFlatNode {
  expandable: boolean;
  isExpanded: boolean;
  label: string;
  item: DocumentItem;
  level: number;
}

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
  subscriptions: Subscription[] = [];
  isReady = false;

  tree_data: any[] = [];

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !node.isPage() && node.children,
      label: node.label,
      item: node,
      isExpanded: true,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ItemFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ItemFlatNode) => node.expandable;

  constructor(
    public properties: LocalStorageService,
    public search: SearchService,
    public layout: LayoutService,
    private api: ApiService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.initTree();
    this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
      if (from === 'pages') {
        this.initTree();
      }
    }));

  }

  initTree() {
    this.isReady = false;
    this.layout.tree = null;
    this.search.selectedTreePid = null;
    if (this.layout.expandedPath.length === 0) {
      this.selectedPid = this.layout.rootItem.pid;
      this.selectedParentPid = this.layout.rootItem.pid;
    } else {
      this.selectedPid = this.layout.expandedPath[this.layout.expandedPath.length - 1];
      this.selectedParentPid = this.layout.expandedPath[this.layout.expandedPath.length - 1];
    }
    // setTimeout(() => {

    //   this.layout.tree = new Tree(this.layout.rootItem);
    //   if (this.layout.expandedPath.length === 0) {
    //     this.layout.tree.item.selected = true;
    //     this.layout.rootItem.selected = true;
    //   }
    // }, 100);

    this.layout.tree = new Tree(this.layout.rootItem);
    const path: string[] = this.layout.expandedPath;
    this.tree_data = [this.layout.rootItem];
    const pid = path.shift();
    if (pid) {
      // this.getChildrenMat(this.layout.rootItem, path);
      this.getChildren(this.layout.tree, path);
    } else {
      //this.dataSource.data = this.tree_data;
      //this.treeControl.expandAll();
      this.isReady = true;
    }


    // this.tree_data = [this.layout.rootItem];
    // this.getChildrenMat(this.layout.rootItem);
    // this.dataSource.data = this.tree_data;
    // console.log(this.layout.rootItem);
  }

  getChildrenMat(item: any, path: string[]) {
    this.api.getRelations(item.pid).subscribe((children: DocumentItem[]) => {
      item.children = children;
      item.isExpanded = true;
      const pid = path.shift();
      if (pid) {
        const child = item.children.find((ch: any) => ch.pid === pid);
        if (child) {
          this.getChildrenMat(child, path);
        }
      } else {
        this.dataSource.data = this.tree_data;
        // this.treeControl.expandAll();
        this.isReady = true;
      }
      
    });
  }

  getChildren(tree: Tree, path: string[]) {
    tree.children = [];
    tree.expanded = true;
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
        this.dataSource.data = this.tree_data;
        this.isReady = true;
      }
      // this.dataSource.data = this.tree_data;
    });
  }

  openFromTree(item: DocumentItem) {
    // this.router.navigate(['/repository', item.pid]);
  }

  selectFromTree(tree: Tree) {
    console.log(this.layout.tree)
    this.layout.clearSelection();
    this.layout.lastSelectedItem = tree.item;
    if (tree.children) {
      this.layout.selectedParentItem = tree.item;
      this.selectedParentPid = tree.item.pid;
      this.layout.items = tree.children.map(ch => ch.item);
      this.layout.clearSelection();
    } else {

      if (this.layout.selectedParentItem.pid !== tree.parent.item.pid || !this.isSelected) {
        this.layout.selectedParentItem = tree.parent.item;
        this.selectedParentPid = tree.parent.item.pid;
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

    // this.layout.expandedPath = [];
    // let p = tree;
    // this.layout.expandedPath.unshift(p.item.pid);
    // while (p.parent) {
    //   p = p.parent;
    //   this.layout.expandedPath.unshift(p.item.pid);
    // }

    this.isSelected = true;
    this.layout.setSelection(true, true);

  }

  select(item: any) {
    console.log(item)
  }

  open(item: any) {
    console.log(item)
  }

}
