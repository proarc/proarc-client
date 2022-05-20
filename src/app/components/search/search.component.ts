import { DocumentItem } from '../../model/documentItem.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Translator } from 'angular-translator';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { ExportDialogComponent } from 'src/app/dialogs/export-dialog/export-dialog.component';
import { UrnbnbDialogComponent } from 'src/app/dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { Tree } from 'src/app/model/mods/tree.model';
import { SearchService } from 'src/app/services/search.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  @ViewChild('split') split: SplitComponent;
  @ViewChild('area1') area1: SplitAreaDirective;
  @ViewChild('area2') area2: SplitAreaDirective;


  splitArea1Width: string;
  splitArea2Width: string;

  state = 'none';
  items: DocumentItem[];

  selectedItem: DocumentItem;

  tree: Tree;

  models: string[]

  model: string;
  query = '';
  queryFiled: string;

  queryLabel: string;
  queryIdentifier: string;
  queryCreator: string

  organization: string;
  owner: string;
  processor: string;


  pageIndex = 0;
  pageSize = 100;
  resultCount = 0;

  sortField: string;
  sortAsc: boolean;

  organizations: string[];
  users: User[];

  searchMode: string = 'phrase';

  constructor(private api: ApiService, 
              public properties: LocalStorageService, 
              public auth: AuthService,
              private dialog: MatDialog,
              private router: Router,
              public search: SearchService,
              private config: ConfigService,
              private ui: UIService,
              private translator: Translator) { 
                this.models = this.config.allModels;
  }

  ngOnInit() {
    this.splitArea1Width = this.properties.getStringProperty('search.split.0', "60"),
    this.splitArea2Width = this.properties.getStringProperty('search.split.1', "40"),
    this.organizations = this.config.organizations;
    this.organization = this.properties.getStringProperty('search.organization', '-');
    this.owner = this.properties.getStringProperty('search.owner', '-');
    this.processor = this.properties.getStringProperty('search.processor', '-');
    this.sortField = this.properties.getStringProperty('search.sort_field', 'created');
    this.sortAsc = this.properties.getBoolProperty('search.sort_asc', false);
    this.model = this.properties.getStringProperty('search.model', this.config.defaultModel);
    this.queryFiled = this.properties.getStringProperty('search.qyery_filed', 'queryLabel');
    if (this.model !== 'all' && this.model !== 'model:page' && this.model !== 'model:ndkpage') {
      this.reload();
    } else {
      this.state = 'success';
    }
    this.api.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }


  dragEnd({sizes}) {
      this.splitArea1Width = sizes[0];
      this.splitArea2Width = sizes[1];
      this.properties.setStringProperty('search.split.0', String(sizes[0]));
      this.properties.setStringProperty('search.split.1', String(sizes[1]));
  }

  getSplitSize(split: number) {
    if (split == 0) {
      return this.splitArea1Width;
    }
    return this.splitArea2Width;
  }

  reload(selectedPid: string = null) {
    this.properties.setStringProperty('search.model', this.model);
    this.properties.setStringProperty('search.qyery_filed', this.queryFiled);
    this.properties.setStringProperty('search.organization', this.organization);
    this.properties.setStringProperty('search.owner', this.owner);
    this.properties.setStringProperty('search.processor', this.processor);
    // this.pageIndex = page;
    this.state = 'loading';

    const options = {
      type: this.searchMode,
      model: this.model,
      organization: this.organization,
      query: this.query,
      queryField: this.queryFiled,
      queryLabel: this.queryLabel,
      queryIdentifier: this.queryIdentifier,
      queryCreator: this.queryCreator,
      page: this.pageIndex,
      owner: this.owner,
      processor: this.processor,
      sortField: this.sortField,
      sortAsc: this.sortAsc
    }

    this.tree = undefined;

    this.api.getSearchResults(options).subscribe(([items, total]: [DocumentItem[], number]) => {
      this.resultCount = total;
      this.items = items;
      if (this.items.length > 0) {
        if (selectedPid) {
          this.selectItem(this.findItem(selectedPid));
        } else {
          this.selectItem(this.items[0]);
        }
        
      }
      this.state = 'success';
    });
  }

  openItem(item: DocumentItem) {
    this.router.navigate(['/document', item.pid]);
  }

  selectItem(item: DocumentItem) {
    this.selectedItem = item;
    this.tree = new Tree(item);
    this.search.selectedTree = this.tree;
    this.tree.expand(this.api);
  }

  findItem(pid: string) {
    return this.items.find(item => item.pid === pid)
  }

  onExpandAll() {
    const data: SimpleDialogData = {
      title: "Rozbalit strom",
      message: "Opravdu chcete rozbalit zvolený objekt? Rozbalení může způsobit nadměrnou zátěž systému.",
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.expandAll();
      }
    });
  }

  private expandAll() {
    this.search.selectedTree.expandAll(this.api);
  }

  onPageChanged(page) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }

  onUrnnbn(item: DocumentItem) {
    const dialogRef = this.dialog.open(UrnbnbDialogComponent, { data: item.pid });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
    
      }
    });
  }

  onExport(item: DocumentItem) {
    const dialogRef = this.dialog.open(ExportDialogComponent, { disableClose: true, data: item.pid });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        
      }
    });
  }

  onDeleteItem() {
    this.onDelete(this.selectedItem, (pids: string[]) => {
      for (let i = this.items.length - 1; i >= 0; i--) {
        if (pids.indexOf(this.items[i].pid) > -1) {
          this.items.splice(i, 1);
        }
      }
    });
  }

  onLock(item: DocumentItem, lock: boolean) {
    const data: SimpleDialogData = {
      title: lock ? 
            String(this.translator.instant('Uzamknout objekt')) :
            String(this.translator.instant('Odemknout objekt')),
      message: lock ? 
            String(this.translator.instant('Opravdu chcete vybrané objekty uzamknout?')) :
            String(this.translator.instant('Opravdu chcete vybrané objekty odemknout?')),
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (lock) {
          this.lockObject(item);
        } else {
          this.unlockObject(item);
        }
        
      }
    });
  }

  lockObject(item: DocumentItem) {
    this.api.lockObjects([item.pid], item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.ui.showInfoSnackBar('Objekt byl úspěšně uzamčen');
        item.isLocked = true;
        //this.reload(item.pid);
      }
      
    });
  }

  unlockObject(item: DocumentItem) {
    this.api.unlockObjects([item.pid], item.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.ui.showInfoSnackBar('Objekt byl úspěšně odemčen');
        item.isLocked = false;
        // this.reload(item.pid);
      }
    });
  }

  onCopyItem() {
    this.api.copyObject(this.selectedItem.pid, this.selectedItem.model).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      const validation: string = response['response']['data'][0]['validation'];
      this.ui.showInfoSnackBar(validation);
      this.state = 'success';
      this.reload();
    }, error => {
      console.log(error);
        this.ui.showInfoSnackBar(error.statusText);
        this.state = 'error';
    });
  }

  onDeleteFromTree() {
    this.onDelete(this.search.selectedTree.item, (pids: string[]) => {
      this.search.selectedTree.remove();
    });
  }

  private onDelete(item: DocumentItem, callback: (pids: string[]) => any = null) {
    const checkbox = {
      label: String(this.translator.instant('editor.children.delete_dialog.permanently')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.delete_dialog.title')),
      message: String(this.translator.instant('editor.children.delete_dialog.message')),
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      checkbox: this.auth.isSuperAdmin() ? checkbox : undefined
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteObject(item, checkbox.checked, callback);
      }
    });
  }

  private deleteObject(item: DocumentItem, pernamently: boolean, callback: (pids: string[]) => any = null) {
    this.state = 'loading';
    this.api.deleteObjects([item.pid], pernamently).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        const removedPid: string[] = response['response']['data'].map(x => x.pid);
        if (callback) {
          callback(removedPid);
        }
        this.state = 'success';
        this.ui.showInfoSnackBar('Objekt byl úspěšně smazan');
        this.reload();
      }
    });
  }


  getSortIcon(field: string) {
    if (this.query) {
      return;
    }
    if (this.sortField === field) {
      if (this.sortAsc) {
        return 'arrow_drop_up';
      } else {
        return 'arrow_drop_down';
      }
    }
  }

  sortBy(field: string) {
    if (this.query) {
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


}
