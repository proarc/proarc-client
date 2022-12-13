import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { defaultLayoutConfig, IConfig, LayoutAdminComponent } from '../layout-admin/layout-admin.component';


@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

  localStorageName = 'proarc-layout-repo';
  // config: IConfig = null;

  pid: string;
  parent: DocumentItem | null;
  expandedPath: string[] = [];
  // selected: string;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private repo: RepositoryService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {

    this.initConfig();

    this.layout.type = 'repo';
    this.layout.setBatchId(null);

    this.subscriptions.push(this.layout.shouldRefresh().subscribe((keepSelection: boolean) => {
      this.loadData(keepSelection);
    }));

    // this.layout.selectionChanged().subscribe(() => {
    //   this.setVisibility();
    // });


    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.pid = p.get('pid');
        if (this.pid) {
          this.layout.lastSelectedItem = null;
          this.loadData(false);
        }
      });
  }

  showLayoutAdmin() {
    const dialogRef = this.dialog.open(LayoutAdminComponent, {
      data: { layout: 'repo' },
      width: '1280px',
      height: '90%',
      panelClass: 'app-dialog-layout-settings'
    });
    dialogRef.afterClosed().subscribe((ret: any) => {
      this.initConfig();
      this.loadData(true);
    });
  }

  initConfig() {
    if (localStorage.getItem(this.localStorageName)) {
      this.layout.layoutConfig = JSON.parse(localStorage.getItem(this.localStorageName))
    } else {
      this.layout.layoutConfig = JSON.parse(JSON.stringify(defaultLayoutConfig));
    }
  }

  onDragEnd(columnindex: number, e: any) {
    // Column dragged
    if (columnindex === -1) {
      // Set size for all visible columns
      this.layout.layoutConfig.columns.filter((c) => c.visible === true).forEach((column, index) => (column.size = e.sizes[index]))
    }
    // Row dragged
    else {
      // Set size for all visible rows from specified column
      this.layout.layoutConfig.columns[columnindex].rows
        .filter((r) => r.visible === true)
        .forEach((row, index) => (row.size = e.sizes[index]))
    }

    localStorage.setItem(this.localStorageName, JSON.stringify(this.layout.layoutConfig));
  }

  canHasChildren(model: string): boolean {
    const a = ModelTemplate.allowedChildrenForModel(model)
    return a?.length > 0;
  }

  loadData(keepSelection: boolean) {
    let pid = this.pid;
    const selection: string[] = [];
    let path: string[] = [];
    let lastSelected: string = null;
    if (keepSelection) {
      this.layout.items.forEach(item => {
        if (item.selected) {
          selection.push(item.pid);
        }
      });
      pid = this.layout.lastSelectedItem.pid;
      lastSelected = this.layout.lastSelectedItem.pid;
      path = JSON.parse(JSON.stringify(this.layout.expandedPath));
    }

    this.layout.ready = false;
    this.layout.path = [];
    this.layout.tree = null;
    this.layout.selectedParentItem = null;
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    const rParent = this.api.getParent(pid);
    forkJoin([rDoc, rChildren, rParent]).subscribe(([item, children, parent]: [DocumentItem, DocumentItem[], DocumentItem]) => {
      this.layout.item = item;
      this.layout.lastSelectedItem = item;
      this.layout.items = children;
      if (keepSelection) {
        this.layout.items.forEach(item => {
          if (selection.includes(item.pid)) {
            item.selected = true;
          }
          if (item.pid === lastSelected) {
            this.layout.lastSelectedItem = item;
          }
        });
      }
      if (this.canHasChildren(item.model)){
        this.layout.selectedParentItem = item;
      }
      
      this.layout.setSelection(false);

      if (parent) {
        if (!this.canHasChildren(item.model)){
          this.layout.selectedParentItem = parent;
          // find siblings
          this.api.getRelations(parent.pid).subscribe((siblings: DocumentItem[]) => {
            if (siblings.length > 0) {
              this.layout.items = siblings;
              this.layout.items.forEach(item => { item.selected = item.pid === pid});
              this.layout.setSelection(false);
            }
          });
        }
        this.layout.path.unshift({ pid: parent.pid, label: parent.label, model: parent.model });
        this.setLayoutPath(parent, keepSelection, path);
      } else {
        this.layout.rootItem = item;
        if (keepSelection) {
          this.layout.expandedPath = JSON.parse(JSON.stringify(path));
        } else {
          this.layout.expandedPath = this.layout.path.map(p => p.pid);
        }
        
        this.layout.ready = true;
      }
    });
  }

  setLayoutPath(item: DocumentItem, keepSelection: boolean, path: string[]) {
    this.api.getParent(item.pid).subscribe((parent: DocumentItem) => {
      if (parent) {
        this.layout.path.unshift({ pid: parent.pid, label: parent.label, model: parent.model });
        this.setLayoutPath(parent, keepSelection, path);
      } else {
        this.layout.rootItem = item;

        if (keepSelection) {
          this.layout.expandedPath = JSON.parse(JSON.stringify(path));
        } else {
          this.layout.expandedPath = this.layout.path.map(p => p.pid);
          this.layout.expandedPath.push(this.layout.lastSelectedItem.pid);
        }
        this.layout.ready = true;
      }
    });
  }

  loadData_(pid: string, keepSelection: boolean) {
    const selection: string[] = [];
    let lastSelected: string = null;
    if (keepSelection) {
      this.layout.items.forEach(item => {
        if (item.selected) {
          selection.push(item.pid);
        }
      });
      lastSelected = this.layout.lastSelectedItem.pid;
    }

    this.layout.path = [];
    this.expandedPath = [];
    this.layout.ready = false;
    this.layout.setBatchId(null);
    this.pid = pid;
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    forkJoin([rDoc, rChildren]).subscribe(([item, children]: [DocumentItem, DocumentItem[]]) => {
      this.layout.item = item;
      //if (children.length === 0) {
      this.layout.selectedParentItem = item;
      //}
      this.layout.lastSelectedItem = item;
      this.layout.items = children;
      if (keepSelection) {
        this.layout.items.forEach(item => {
          if (selection.includes(item.pid)) {
            item.selected = true;
          }
          if (item.pid === lastSelected) {
            this.layout.lastSelectedItem = item;
          }
        });
      }
      this.layout.ready = true;
      this.layout.setSelection(false);


      this.api.getParent(pid).subscribe((parent: DocumentItem) => {

        this.parent = parent;
        this.layout.parent = parent;
        this.layout.path = [];
        this.expandedPath = [];
        if (parent) {
          parent.selected = true;
          this.layout.path.unshift({ pid: parent.pid, label: parent.label, model: parent.model });
          this.expandedPath.unshift(parent.pid);
          this.setPath(parent, parent.pid);
          if (!this.layout.allowedChildrenModels() || this.layout.allowedChildrenModels().length === 0) {
            // if  (children.length === 0) {
            this.layout.selectedParentItem = parent;
            // find siblings
            this.api.getRelations(parent.pid).subscribe((siblings: DocumentItem[]) => {
              if (siblings.length > 0) {
                this.layout.items = siblings;
              }
            });
          }

        } else {
          this.layout.tree = new Tree(item);
          this.layout.expandedPath = this.expandedPath;
        }
        this.setupNavigation();

      });
    });
  }

  selectItem(item: DocumentItem) {
    item.selected = true;
    // this.search.selectedTreePid = item.pid;
    // this.tree = new Tree(item);

  }

  setPath(child: DocumentItem, pid: string) {
    this.api.getParent(pid).subscribe((item: DocumentItem) => {
      if (item) {
        this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
        this.expandedPath.unshift(item.pid);
        this.setPath(item, item.pid);
      } else {
        this.layout.tree = new Tree(child);
        this.layout.expandedPath = this.expandedPath;
      }
    });
  }

  private setupNavigation() {
    this.layout.previousItem = null;
    this.layout.nextItem = null;
    if (!this.parent) {
      return;
    }
    const parentId = this.parent.pid;
    this.api.getRelations(this.parent.pid).subscribe((siblings: DocumentItem[]) => {
      let index = -1;
      let i = -1;
      for (const sibling of siblings) {
        i += 1;
        if (sibling.pid === this.layout.item.pid) {
          index = i;
          break;
        }
      }
      if (index >= 1 && this.parent.pid == parentId) {
        this.layout.previousItem = siblings[index - 1];
      }
      if (index >= 0 && index < siblings.length - 1) {
        this.layout.nextItem = siblings[index + 1];
      }
    });
  }

  hasPendingChanges(): boolean {
    return this.repo.hasPendingChanges();
  }

  public goToObject(item: DocumentItem) {
    if (item) {
      this.router.navigate(['/repository', item.pid]);
    }
  }

  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }

}
