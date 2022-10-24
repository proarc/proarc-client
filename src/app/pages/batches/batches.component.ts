import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { Batch } from 'src/app/model/batch.model';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';
import { IConfig, defaultLayoutConfig } from '../layout-admin/layout-admin.component';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  localStorageName = 'proarc-layout-import';
  config: IConfig = null;

  batchId: string;
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
    this.layout.type = 'import';

    this.layout.shouldRefresh().subscribe(() => {
      this.loadData(this.batchId);
    });

    this.layout.selectionChanged().subscribe(() => {
      this.setVisibility();
    });


    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.batchId = p.get('batch_id');
        if (this.batchId) {
          this.loadData(this.batchId);
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


  loadData(id: string) {
    this.layout.ready = false;

    const obj = new DocumentItem();
    obj.pid = id;
    this.api.getImportBatch(parseInt(id)).subscribe((batch: Batch) => {
      obj.parent = batch.parentPid;
      this.layout.setBatchId(id);
      this.api.getBatchPages(id).subscribe((response: any) => {
        if (response['response'].errors) {
          this.ui.showErrorSnackBarFromObject(response['response'].errors);
          return;
        }
        const pages: DocumentItem[] = DocumentItem.pagesFromJsonArray(response['response']['data']);
        this.layout.item = obj;
        this.layout.items = pages;
        this.layout.items[0].selected = true;
        this.layout.ready = true;
        this.layout.setSelection();

        // this.layout.allowedChildrenModels = ModelTemplate.allowedChildrenForModel(item.model);

        // this.parent = item;
        // this.layout.parent = item;
        // this.layout.path = [];
        // if (item) {
        //   this.layout.path.unshift({ pid: item.pid, label: item.label, model: item.model });
        //   this.setPath(item.pid);
        // }
        // this.setupNavigation();
        this.setVisibility();
      });
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
    return false;
  }


}
