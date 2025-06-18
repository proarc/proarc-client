import { Component, computed, input, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { TreeDocumentItem, DocumentItem } from '../../model/documentItem.model';
import { Tree } from '../../model/mods/tree.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserTreeTableComponent } from "../../components/user-tree-table/user-tree-table.component";
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  imports: [TranslateModule, UserTreeTableComponent, MatIconModule, MatProgressBarModule, MatTooltipModule],
  selector: 'app-editor-tree',
  templateUrl: './editor-tree.component.html',
  styleUrls: ['./editor-tree.component.scss']
})
export class EditorTreeComponent implements OnInit {

  
  panel = input<ILayoutPanel>();
  rootItem = input<DocumentItem>();
  selectedItem = input<DocumentItem>();

  rootTreeItem = computed(() => {
    return <TreeDocumentItem> this.rootItem();
  }) ;

  selectedTreeItem = computed(() => {
    return <TreeDocumentItem> this.selectedItem();
  }) ;

  loading: boolean = true;
  treeItems: TreeDocumentItem[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private translator: TranslateService,
    private ui: UIService,
    public layout: LayoutService,
    private api: ApiService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.initTree();
    // this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
    //   if (from === 'pages') {
    //     this.refreshChildren();
    //   }
    // }));

  }

  selectTreeItem(item: any){
    const sel = <DocumentItem>item;
    sel.selected=true;
    this.layout.lastSelectedItem.set(sel);
    // this.layout.items = tree.children.map(ch => ch.item);
    this.layout.setSelection(true, null, true);
  }

  onTreeItemsChanged(items: any[]) {
    this.treeItems = items
  }

  initTree() {
    this.loading = false;
    // if (this.initialPath.length === 0) {
    //   this.selectedPid = this.layout.rootItem.pid;
    //   this.selectedParentPid = this.layout.rootItem.pid;
    // } else {
    //   this.selectedPid = this.initialPathh[this.layout.expandedPath.length - 1];
    //   this.selectedParentPid = this.initialPath[this.layout.expandedPath.length - 1];
    // }
    // this.layout.tree = new Tree(this.layout.rootItem);
    // const path: string[] = JSON.parse(JSON.stringify(this.layout.expandedPath));
    // const pid = path.shift();
    // if (pid) {
    //   this.getChildren(this.layout.tree, path);
    // } else {
    //   this.loading = false;
    // }
  }

  // getChildren(tree: Tree, path: string[]) {
  //   tree.children = [];
  //   tree.expanded = true;
  //   this.api.getRelations(tree.item.pid).subscribe((children: DocumentItem[]) => {
  //     for (const child of children) {
  //       const childTree = new Tree(child, tree, tree.level + 1);
  //       tree.children.push(childTree);
  //     }
  //     const pid = path.shift();
  //     if (pid) {
  //       const child = tree.children.find(ch => ch.item.pid === pid);
  //       if (child) {
  //         this.getChildren(child, path);
  //       }
  //     } else {
  //       this.selectFromTree(tree);
  //       this.isReady = true;
  //     }
  //   });
  // }

  treeInfoChanged(info: {tree_info: { [model: string]: number }, batchInfo: any}) {
    // this.tree_info = info.tree_info;
    // this.batchInfo = info.batchInfo;
  }


}
