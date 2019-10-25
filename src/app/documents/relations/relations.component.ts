import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from './../../model/documentItem.model';
import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss']
})
export class RelationsComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];

  layout = 'table';

  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.api.getRelations(id, id).subscribe((items: DocumentItem[]) => {
        this.items = items;
        this.state = 'success';
      });
    });
  }

  thumb(pid: string) {
    return this.api.getThumbUrl(pid);
  }

}
