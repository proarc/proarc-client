import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { StreamProfile } from 'src/app/model/stream-profile';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { TemplateService } from 'src/app/services/template.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { defaultLayoutConfig, IConfig, LayoutAdminComponent } from 'src/app/dialogs/layout-admin/layout-admin.component';


@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

  localStorageName = 'proarc-layout-repo';
  // config: IConfig = null;

  pid: string;
  // parent: DocumentItem | null;
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
    private tmpl: TemplateService,
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

    this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe((from: string) => {
      setTimeout(() => {
        this.refreshSelected(from);
      }, 10)
      
    }));

    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      setTimeout(() => {
        if (this.layout.lastSelectedItem) {
          this.loadMetadata(this.layout.lastSelectedItem.pid, this.layout.lastSelectedItem.model);
        }
        
      }, 10)
      
    }));

    this.layout.lastSelectedItemMetadata = null;
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        this.layout.items = [];
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
    let idx = 0;
    if (localStorage.getItem(this.localStorageName)) {
      this.layout.layoutConfig = JSON.parse(localStorage.getItem(this.localStorageName));
      this.layout.layoutConfig.columns.forEach(c => {
        c.rows.forEach(r => {
          if (!r.id) {
            r.id = 'panel' + idx++;
          }
        });
      });
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
    this.layout.setResized();
  }

  canHasChildren(model: string): boolean {
    const a = ModelTemplate.allowedChildrenForModel(model)
    return a?.length > 0;
  }

  selectLast() {
    this.layout.items.forEach(i => i.selected = false);
    //this.layout.rootItem.selected = true;
    this.layout.lastSelectedItem = this.layout.item;
    this.layout.setSelection(false);
  }

  refreshSelected(from: string) {
    if (from === 'metadata') {
      this.layout.lastSelectedItemMetadata = null;
      const pid = this.layout.lastSelectedItem.pid;
      const model = this.layout.lastSelectedItem.model;
      const rDoc = this.api.getDocument(this.layout.lastSelectedItem.pid);
      const rMetadata = this.api.getMetadata(pid);
      forkJoin([rDoc, rMetadata]).subscribe(([item, respMeta]: [DocumentItem, any]) => {
        const selected = this.layout.lastSelectedItem.selected;
        Object.assign(this.layout.lastSelectedItem, item);
        this.layout.lastSelectedItem.selected = selected;

        
        const standard = respMeta['record']['standard'] ? respMeta['record']['standard'] : Metadata.resolveStandardFromXml(respMeta['record']['content']);
        this.tmpl.getTemplate(standard, model).subscribe((tmpl: any) => {
          this.layout.lastSelectedItemMetadata = new Metadata(pid, model, respMeta['record']['content'], respMeta['record']['timestamp'], standard, tmpl);
        })
        // this.layout.lastSelectedItemMetadata = new Metadata(pid, model, respMeta['record']['content'], respMeta['record']['timestamp'], respMeta['record']['standard']);
      });
    } else if(from === 'pages') {
      this.refreshPages();
    } else {
      this.api.getDocument(this.layout.lastSelectedItem.pid).subscribe((item: DocumentItem) =>{
        const selected = this.layout.lastSelectedItem.selected;
        Object.assign(this.layout.lastSelectedItem, item);
        this.layout.lastSelectedItem.selected = selected;
        if (!!from) {
          this.layout.shouldMoveToNext(from);
        }
      });
    }
  }

  refreshPages() {
    const selection: string[] = [];
    const lastSelected = this.layout.lastSelectedItem.pid;
    this.layout.items.forEach(item => {
      if (item.selected) {
        selection.push(item.pid);
      }
    });
    this.layout.items = [];
    this.api.getRelations(this.layout.selectedParentItem.pid).subscribe((children: DocumentItem[]) =>{
      
      this.layout.items = children;
      for (let i=0; i < this.layout.items.length; i++) {
        const item = this.layout.items[i];
        if (selection.includes(item.pid)) {
          item.selected = true;
          Object.assign(item, children[i]);
        }
        if (item.pid === lastSelected) {
          this.layout.lastSelectedItem = item;
        }
      }
      this.layout.expandedPath = this.layout.path.map(p => p.pid);
    });
  }

  loadData(keepSelection: boolean) {
    let pid = this.pid;
    const selection: string[] = [];
    let path: string[] = [];
    let lastSelected: string = null;
    let selectedParentItem: DocumentItem = null;
    if (keepSelection) {
      this.layout.items.forEach(item => {
        if (item.selected) {
          selection.push(item.pid);
        }
      });
      pid = this.layout.lastSelectedItem.pid;
      lastSelected = this.layout.lastSelectedItem.pid;
      selectedParentItem = this.layout.selectedParentItem;
      path = JSON.parse(JSON.stringify(this.layout.expandedPath));
    }

    this.layout.ready = false;
    this.layout.path = [];
    this.layout.tree = null;
    this.layout.parent = null;
    this.layout.selectedParentItem = null;
    this.layout.lastSelectedItem = null;
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    const rParent = this.api.getParent(pid);
    // const rProfiles = this.api.getStreamProfile(pid);
    forkJoin([rDoc, rChildren, rParent]).subscribe(([item, children, parent]: [DocumentItem, DocumentItem[], DocumentItem]) => {
      this.layout.item = item;
      this.layout.lastSelectedItem = item;
      this.layout.items = children;
      // this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
      if (keepSelection) {
        this.layout.items.forEach(ch => {
          if (selection.includes(ch.pid)) {
            ch.selected = true;
          }
          if (ch.pid === lastSelected) {
            this.layout.lastSelectedItem = ch;
          }
        });
        this.layout.selectedParentItem = selectedParentItem;
      }
      if (this.canHasChildren(item.model) && !keepSelection){
        this.layout.selectedParentItem = item;
      }
      
      this.layout.setSelection(false);
      this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });

      if (parent) {
        this.layout.parent = parent;
        if (!this.canHasChildren(item.model)){ 
          if(!keepSelection) {
            this.layout.selectedParentItem = parent;
          }
          
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
        this.layout.ready = true;
      }
      if (keepSelection) {
        this.layout.expandedPath = JSON.parse(JSON.stringify(path));
      } else {
        this.layout.expandedPath = this.layout.path.map(p => p.pid);
      }
      this.setupNavigation();
    });
  }

   loadMetadata(pid: string, model: string) {

    if (this.layout.lastSelectedItemMetadata && this.layout.lastSelectedItemMetadata.pid === pid) {
      return;
    }
    this.layout.lastSelectedItemMetadata = null;
    if (!pid) {
      return;
    }
    this.api.getMetadata(pid).subscribe((response: any) => {
      if (response.errors) {
        console.log('error', response.errors);
        this.ui.showErrorDialogFromObject(response.errors);
        return;
      }

      if (!response['record']) {
        this.ui.showErrorSnackBar('Error getting metadata');
        return;
      }
      
      const standard = response['record']['standard'] ? response['record']['standard'] : Metadata.resolveStandardFromXml(response['record']['content']);
      this.tmpl.getTemplate(standard, model).subscribe((tmpl: any) => {
        this.layout.lastSelectedItemMetadata = new Metadata(pid, model, response['record']['content'], response['record']['timestamp'], standard, tmpl);
      });
      // this.layout.lastSelectedItemMetadata = new Metadata(pid, model, response['record']['content'], response['record']['timestamp'], response['record']['standard']);
      
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
        }
        this.layout.ready = true;
      }
    });
  }

  selectItem(item: DocumentItem) {
    item.selected = true;
    // this.search.selectedTreePid = item.pid;
    // this.tree = new Tree(item);

  }

  // setPath(child: DocumentItem, pid: string) {
  //   this.api.getParent(pid).subscribe((item: DocumentItem) => {
  //     if (item) {
  //       this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
  //       this.expandedPath.unshift(item.pid);
  //       this.setPath(item, item.pid);
  //     } else {
  //       this.layout.tree = new Tree(child);
  //       this.layout.expandedPath = this.expandedPath;
  //     }
  //   });
  // }

  private setupNavigation() {
    this.layout.previousItem = null;
    this.layout.nextItem = null;
    if (!this.layout.parent) {
      return;
    }
    const parentId = this.layout.parent.pid;
    this.api.getRelations(this.layout.parent.pid).subscribe((siblings: DocumentItem[]) => {
      let index = -1;
      let i = -1;
      for (const sibling of siblings) {
        i += 1;
        if (sibling.pid === this.layout.item.pid) {
          index = i;
          break;
        }
      }
      if (index >= 1 && this.layout.parent.pid == parentId) {
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
