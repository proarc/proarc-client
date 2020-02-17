import { DocumentItem } from '../../model/documentItem.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ProArc } from 'src/app/utils/proarc';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];

  models = ProArc.models;

  model: string;
  query = '';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  constructor(private api: ApiService, private properties: LocalStorageService) { 
  }

  ngOnInit() {
    this.model = this.properties.getStringProperty('search.model', ProArc.defaultModel);
    if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      this.reload();
    } else {
      this.state = 'success';
    }
  }

  reload(page: number = 0) {
    this.properties.setStringProperty('search.model', this.model);
    this.pageIndex = page;
    this.state = 'loading';
    this.api.getSearchResults(this.model, this.query, this.pageIndex).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      this.state = 'success';
    });
  }

  onPageChanged(page) {
    this.reload(page.pageIndex);
  }



}
