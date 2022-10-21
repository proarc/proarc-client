import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { defaultLayoutConfig, IConfig } from '../layout-admin/layout-admin.component';


@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

  localStorageName = 'proarc-layout-repo';
  config: IConfig = null;

  pid: string;
  parent: DocumentItem | null;
  previousItem: DocumentItem | null;
  nextItem: DocumentItem | null;
  // selected: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // public editor: EditorService,
    private repo: RepositoryService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    // if (localStorage.getItem(this.localStorageName)) {
    //   this.config = JSON.parse(localStorage.getItem(this.localStorageName))
    // } else {
    //   this.config = JSON.parse(JSON.stringify(defaultLayoutConfig));
    // }
    this.layout.type = 'repo';

    this.layout.shouldRefresh().subscribe(() => {
      this.loadData(this.pid);
    });

    this.layout.selectionChanged().subscribe(() => {
      this.setVisibility();
    });


    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.pid = p.get('pid');
        if (this.pid) {
          this.loadData(this.pid);
        }
      });
  }

  setVisibility() {
    

    if (localStorage.getItem(this.localStorageName)) {
      this.config = JSON.parse(localStorage.getItem(this.localStorageName))
    } else {
      this.config = JSON.parse(JSON.stringify(defaultLayoutConfig));
    }

    this.config.columns.forEach(c => {
      c.rows.forEach(r => {
        if (r.type === 'image' && r.visible) {
          r.isEmpty = !(this.layout.selectedItem && this.layout.selectedItem.isPage());
        }
      });
      c.visible = c.rows.findIndex(r => r.visible && !r.isEmpty) > -1;
    });
    
  }


  loadData(pid: string) {
    this.layout.ready = false;
    this.pid = pid;
    const rDoc = this.api.getDocument(pid);
    const rChildren = this.api.getRelations(pid);
    forkJoin([rDoc, rChildren]).subscribe(([item, children]: [DocumentItem, DocumentItem[]]) => {
      this.layout.item = item;
      this.layout.items = children;
      this.layout.ready = true;
      this.layout.setSelection();
      this.layout.allowedChildrenModels = ModelTemplate.allowedChildrenForModel(item.model);

      this.api.getParent(pid).subscribe((item: DocumentItem) => {

        this.parent = item;
        this.layout.parent = item;
        this.layout.path = [];
        if (item) {
          this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
          this.setPath(item.pid);
        }
        this.setupNavigation();

      });
      this.setVisibility();
    });
  }

  setPath(pid: string) {
    this.api.getParent(pid).subscribe((item: DocumentItem) => {
      if (item) {
        this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
        this.setPath(item.pid);
      }
    });
  }

  private setupNavigation() {
    this.previousItem = null;
    this.nextItem = null;
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
        this.previousItem = siblings[index - 1];
      }
      if (index >= 0 && index < siblings.length - 1) {
        this.nextItem = siblings[index + 1];
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
