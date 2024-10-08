import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';


@Component({
  selector: 'app-editor-tree',
  templateUrl: './editor-tree.component.html',
  styleUrls: ['./editor-tree.component.scss']
})
export class EditorTreeComponent implements OnInit {

  @Input('panel') panel: ILayoutPanel;

  columns: { field: string, visible: boolean, prefix?: string, type?: string }[] = [
    // { field: 'label', visible: true },
    { field: 'model', visible: true, type: 'translatable', prefix: 'model' },
    { field: 'processor', visible: false },
    { field: 'organization', visible: false, type: 'translatable', prefix: 'organization' },
    { field: 'status', visible: true, type: 'translatable', prefix: 'editor.atm.statuses' },
    { field: 'created', visible: false, type: 'date' },
    { field: 'modified', visible: true, type: 'date' },
    { field: 'owner', visible: true },
    { field: 'export', visible: false },
    { field: 'isLocked', visible: true, type: 'boolean' }
  ];

  isSelected = false;
  selectedPid: string;
  selectedParentPid: string;
  // selectedTree: Tree;
  subscriptions: Subscription[] = [];
  isReady = false;

  constructor(
    public properties: LocalStorageService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private config: ConfigService,
    private ui: UIService,
    public layout: LayoutService,
    private api: ApiService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.initTree();
    this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
      if (from === 'pages') {
        this.refreshChildren();
      }
    }));

  }

  findTree(pid: string) {
    return this.findByPid(this.layout.tree, pid);
  }

  findByPid(tree: Tree, pid: string) {
    if (tree.item.pid === pid) {
      return tree;
    }
    if (tree.children) {
      for (const ch of tree.children) {
        if (ch.item.pid === pid) {
          return ch;
        } else {
          const f: Tree = this.findByPid(ch, pid);
          if (f) {
            return f;
          }
        }
      };
    }
    return null;
  }


  refreshChildren() {
    const tree = this.findTree(this.layout.selectedParentItem.pid);
    if (!tree) {
      return
    }
    tree.children = [];
    this.api.getRelations(this.layout.selectedParentItem.pid).subscribe((children: DocumentItem[]) => {
      for (const child of children) {
        const childTree = new Tree(child, tree, tree.level + 1);
        tree.children.push(childTree);
      }
      this.isReady = true;
    });
  }

  initTree() {
    this.isReady = false;
    this.layout.tree = null;
    if (this.layout.expandedPath.length === 0) {
      this.selectedPid = this.layout.rootItem.pid;
      this.selectedParentPid = this.layout.rootItem.pid;
    } else {
      this.selectedPid = this.layout.expandedPath[this.layout.expandedPath.length - 1];
      this.selectedParentPid = this.layout.expandedPath[this.layout.expandedPath.length - 1];
    }
    this.layout.tree = new Tree(this.layout.rootItem);
    const path: string[] = JSON.parse(JSON.stringify(this.layout.expandedPath));
    const pid = path.shift();
    if (pid) {
      this.getChildren(this.layout.tree, path);
    } else {
      this.isReady = true;
    }
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
        this.selectFromTree(tree);
        this.isReady = true;
      }
      // this.dataSource.data = this.tree_data;
    });
  }

  openFromTree(item: DocumentItem) {
    // this.router.navigate(['/repository', item.pid]);
  }

  selectFromTree(tree: Tree) {
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

      if (tree.expandable2()) {
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
    this.layout.setSelection(true, null, true);

  }

  select(item: Tree) {
    if (item.expandable2() && !item.expanded) {
      item.expand(this.api, false, () => {
        this.selectFromTree(item);
      });
    } else {
      this.selectFromTree(item);
    }
    

  }

  open(item: any) {
    //console.log(item)
  }

  toggle(event: any, item: Tree) {
    event.stopPropagation();
    event.preventDefault();
    if (!item.expanded) {
      item.expand(this.api, false);
    } else {
      item.expanded = false;
    }
  }

  mouseOver(tree: Tree, event: any) {
    if (this.layout.dragging) {
      this.dragenter(tree, event)
    }
  }

  mouseUp(tree: Tree, event: any) {
    if (this.layout.dragging) {
      this.drop(tree, event)
    }
  }

  mouseLeave(tree: Tree, event: any) {
    if (this.layout.dragging) {
      this.dragleave(event)
    }
  }

  dragenter(tree: Tree, event: any) {
    if (event.target.classList.contains("app-row")) {
      const source: DocumentItem = this.layout.lastSelectedItem;
      const target: DocumentItem = tree.item;
      const allowed = ModelTemplate.allowedChildrenForModel(this.config.allModels,target.model).includes(source.model);
      if (allowed) {
        event.target.classList.add("dragoverAllowed");
      } else {
        event.target.classList.add("dragoverNotAllowed");
      }
    }
    event.preventDefault();
  }

  dragleave(event: any) {
    if (event.target.classList.contains("app-row")) {
      event.target.classList.remove("dragoverAllowed");
      event.target.classList.remove("dragoverNotAllowed");
    }
  }

  dragstart(event: DragEvent) {
    // event.dataTransfer.setData("tree", "KK");
    // console.log(event)
  }

  dragend(tree: Tree, event: any) {
    // console.log(event)
  }

  drop(tree: Tree, event: any) {
    // const items: DocumentItem[] = JSON.parse(event.dataTransfer?.getData("items"));
    const items: DocumentItem[] = this.layout.items.filter(i => i.selected);
    if (items[0].parent !== tree.item.pid) {
      this.changeParent(items, tree);
    }
    this.layout.dragging = false;
    // console.log(JSON.parse(event.dataTransfer?.getData("items")));
  }

  dragover(event: any) {
    event.preventDefault();
  }

  changeParent(items: DocumentItem[], newParent: Tree) {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.tree.change_parent_title')),
      message: String(this.translator.instant('editor.tree.change_parent_msg')),
      alertClass: 'app-message',
      btn1: {
        label: String(this.translator.instant('common.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('common.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.relocateObjects(items, newParent.item);
      }
    });
  }

  relocateObjects(items: DocumentItem[], destItem: DocumentItem) {
    let pids: string[] = items.filter(c => c.selected).map(c => c.pid);

    this.api.relocateObjects(items[0].parent, destItem.pid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      // refresh whole tree
      const selectedTree = this.findTree(this.layout.selectedParentItem.pid);
      this.layout.expandedPath = [];
      this.layout.expandedPath.unshift(selectedTree.item.pid);
      let parent = selectedTree.parent;
      while (parent) {
        this.layout.expandedPath.unshift(parent.item.pid);
        parent = parent.parent;
      }
      this.initTree();

    });
  }

}
