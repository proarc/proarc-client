import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { LayoutService } from 'src/app/services/layout.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { ModelTemplate } from 'src/app/templates/modelTemplate';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

  pid: string;
  // selected: string;

  constructor(
    private route: ActivatedRoute,
    public editor: EditorService,
    private repo: RepositoryService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService
  ) { }

  ngOnInit(): void {

    this.layout.type = 'repo';

    this.layout.selectionChanged().subscribe(() => {
      // if (this.layout.getNumOfSelected() == 0) {
      //   this.selectedPid = this.layout.item.pid;
      // } else {
      //   this.selectedPid = this.layout.selectedItem.pid;
      // }
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
      // this.allowedChildrenModels = ModelTemplate.allowedChildrenForModel(item.model);
    });
  }

  hasPendingChanges(): boolean {
    return this.repo.hasPendingChanges();
  }

}
