import { SearchResult } from './../../model/searchResult.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  state = 'none';
  results: SearchResult[];

  models = [
    'model:ndkperiodical',
    'model:ndkperiodicalvolume',
    'model:ndkperiodicalissue',
    'model:ndkperiodicalsupplement',
    'model:ndkarticle',
    'model:ndkmonographvolume',
  ];

  model = 'model:ndkperiodical';
  query = '';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 200;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.state = 'loading';
    this.api.getSearchResults(this.model, this.query, this.pageIndex).subscribe((results: SearchResult[]) => {
      this.results = results;
      this.state = 'success';
      console.log('result', results);
    });
  }

  onPageChanged(page) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }



}
