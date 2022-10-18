import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { EditorService } from 'src/app/services/editor.service';
import { RepositoryService } from 'src/app/services/repository.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

  pid: string;
  selectedPid: string;

  constructor(
    private route: ActivatedRoute,
    public editor: EditorService,
    public repo: RepositoryService
  ) { }

  ngOnInit(): void {

    this.repo.selectionChanged().subscribe(() => {
      if (this.repo.getNumOfSelected() == 0) {
        this.selectedPid = this.repo.item.pid;
      } else if (this.repo.getNumOfSelected() == 0) {
        this.selectedPid = this.repo.getFirstSelected().pid;
      } else {
        this.selectedPid = this.repo.getFirstSelected().pid;
      }
    });

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.pid = p.get('pid');
        this.selectedPid = this.pid;
        if (this.pid) {
          this.repo.loadData(this.pid);

          this.editor.init({
            pid: this.pid,
            preparation: false,
            metadata: null,
            isNew: false
          });
        }

      });
  }

  ngOnChanges() {
    this.selectedPid = this.repo.getNumOfSelected() < 1 ? this.pid : this.repo.getFirstSelected().pid
  }

  hasPendingChanges(): boolean {
    return this.repo.hasPendingChanges();
  }

}
