import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tree } from 'src/app/model/mods/tree.model';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {


  @Input('tree') tree: Tree;

  constructor(public properties: LocalStorageService, 
    private router: Router,
    private api: ApiService, 
    public search: SearchService) { 
  }

  ngOnInit() {

  }

  select() {
    console.log('select', this.tree);
    this.search.selectedTree = this.tree;
  }

  toggle(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.tree.expanded) {
      this.tree.expand(this.api);
    } else {
      this.tree.expanded = false;
    }
  }

  open() {
    this.router.navigate(['/document', this.tree.item.pid]);
  }

}
