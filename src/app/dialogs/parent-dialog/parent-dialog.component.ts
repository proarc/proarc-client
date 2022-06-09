
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfigService } from 'src/app/services/config.service';
import { User } from 'src/app/model/user.model';
import { Tree } from 'src/app/model/mods/tree.model';

@Component({
  selector: 'app-parent-dialog',
  templateUrl: './parent-dialog.component.html',
  styleUrls: ['./parent-dialog.component.scss']
})
export class ParentDialogComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];
  selectedItem: DocumentItem;
  selectedTree: Tree;
  models: string[];
  model: string;
  query = '';
  queryField: string;
  searchMode: string = 'phrase';

  sortField: string = '';
  sortAsc: boolean;

  queryLabel: string;
  queryIdentifier: string;
  queryCreator: string

  organization: string;
  owner: string;
  processor: string;
  organizations: string[];
  users: User[];


  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  hierarchy: DocumentItem[];
  
  tree: Tree;
  expandedPath: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ParentDialogComponent>,
    public properties: LocalStorageService,
    private config: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService) { 
      this.models = this.config.allModels;
    }

  ngOnInit() {
    this.model = this.properties.getStringProperty('search.model', this.config.defaultModel);
    this.queryField = this.properties.getStringProperty('search.query_field', 'queryLabel');

    this.organizations = this.config.organizations;
    this.organization = this.properties.getStringProperty('search.organization', '-');
    this.owner = this.properties.getStringProperty('search.owner', '-');
    this.processor = this.properties.getStringProperty('search.processor', '-');
    this.sortField = this.properties.getStringProperty('search.sort_field', 'created');
    this.sortAsc = this.properties.getBoolProperty('search.sort_asc', false);
    if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      this.reload();
    } else {
      this.state = 'success';
    }
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });


    this.reload();
  }

  getSortIcon(field: string) {
    // if (this.query) {
    //   return;
    // }
    if (this.sortField === field) {
      if (this.sortAsc) {
        return 'arrow_drop_up';
      } else {
        return 'arrow_drop_down';
      }
    }
    return '';
  }

  sortBy(field: string) {
    // if (this.query) {
    //   return;
    // }
    if (this.hierarchy.length > 0) {
      return;
    }
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortAsc = false;
    }
    this.sortField = field;
    this.properties.setStringProperty('search.sort_field', this.sortField);
    this.properties.setBoolProperty('search.sort_asc', this.sortAsc);
    this.reload();
  }

  reload(page: number = 0) {
    // this.properties.setStringProperty('search.model', this.model);
    // this.properties.setStringProperty('search.query_field', this.queryField);
    this.hierarchy = [];
    this.selectedItem = null;
    this.pageIndex = page;
    this.state = 'loading';
    const options = {
      type: this.searchMode,
      model: this.model,
      query: this.query,
      queryField: this.queryField,
      page: this.pageIndex,
      sortField: this.sortField,
      sortAsc: this.sortAsc,
      
      organization: this.organization,
      queryLabel: this.queryLabel,
      queryIdentifier: this.queryIdentifier,
      queryCreator: this.queryCreator,
      owner: this.owner,
      processor: this.processor,

    }
    this.api.getSearchResults(options).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      this.state = 'success';
      if (this.data.selectedTree) {
        this.setExpandedPath(this.data.selectedTree);
        const root = this.data.selectedTree.getParentByLevel(0);
        if (root) {
          const item = this.items.find(i => i.pid === root.item.pid);
          if (item) {
            this.selectItem(item);
          }
          
        }
      }
    });
  }

  setExpandedPath(tree: Tree) {
    this.expandedPath.push(tree.item.pid);
    if(tree.parent) {
      this.setExpandedPath(tree.parent);
    }
  }

  onPageChanged(page: any) {
    this.reload(page.pageIndex);
  }

  onSave() {
    if (!this.selectedItem) {
      return;
    }
    this.dialogRef.close({pid: this.selectedItem.pid, selectedItem: this.selectedItem, selectedTree: this.selectedTree});
  }

  deleteParent() {
    this.dialogRef.close({delete: true});
  }

  selectItem(item: DocumentItem) {
    this.selectedItem = item;
    this.tree = new Tree(item);
    
  }

  open(item: DocumentItem, index: number = -1) {
    // if (item.isPage()) {
    //   return;
    // }
    // if (index > -1) {
    //   this.hierarchy.splice(index);
    // }
    // this.selectedItem = null;
    // this.hierarchy.push(item);
    // this.loadChildrenForPid(item.pid);
  }


  private loadChildrenForPid(pid: string) {
    this.state = 'loading';
    this.api.getRelations(pid).subscribe((children: DocumentItem[]) => {
      this.items = [];
      for (const child of children) {
        if (!child.isPage()) {
          this.items.push(child);
        }
      }
      this.state = 'success';
    });
  }

  openFromTree(item: DocumentItem) {
    this.selectedItem = item;
  }

  selectFromTree(tree: Tree) {
    this.selectedTree = tree;
    this.selectedItem = tree.item;
  }

}

