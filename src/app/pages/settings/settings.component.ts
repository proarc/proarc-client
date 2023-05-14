import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NewPasswordDialogComponent } from 'src/app/dialogs/new-password-dialog/new-password-dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UIService } from 'src/app/services/ui.service';
import { CodebookService } from 'src/app/services/codebook.service';
import { PreferredTopsDialogComponent } from 'src/app/dialogs/preferred-tops-dialog/preferred-tops-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { FormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { DocumentItem } from '../../model/documentItem.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  state = 'none';
  user: User;

  forename: string;
  surname: string;

  searchCols: any;
  selectedModels = new FormControl('');

  relatedItemExpanded: boolean;

  isRepo: boolean;

  @ViewChild('table') table: MatTable<DocumentItem>;
  public selectedColumnsSearch = [
    { field: 'label', selected: true },
    { field: 'model', selected: true },
    { field: 'pid', selected: true },
    { field: 'processor', selected: true },
    { field: 'organization', selected: true },
    { field: 'status', selected: true },
    { field: 'created', selected: true },
    { field: 'modified', selected: true },
    { field: 'owner', selected: true },
    { field: 'export', selected: true },
    { field: 'isLocked', selected: true }
  ];

  public selectedColumnsEditingRepo = [
    { field: 'pageType', selected: true, width: 140 },
    { field: 'pageNumber', selected: true, width: 140 },
    { field: 'pageIndex', selected: true, width: 140 },
    { field: 'pagePosition', selected: true, width: 140 },
    { field: 'model', selected: true, width: 140 },
    { field: 'pid', selected: false, width: 140 },
    { field: 'owner', selected: false, width: 140 },
    { field: 'created', selected: false, width: 140 },
    { field: 'modified', selected: true, width: 140 },
    { field: 'status', selected: false, width: 140 }
  ];

  public selectedColumnsEditingImport = [
    { field: 'pageType', selected: true, width: 140 },
    { field: 'pageNumber', selected: true, width: 140 },
    { field: 'pageIndex', selected: true, width: 140 },
    { field: 'pagePosition', selected: true, width: 140 },
    { field: 'model', selected: true, width: 140 },
    { field: 'pid', selected: false, width: 140 },
    { field: 'owner', selected: false, width: 140 },
    { field: 'created', selected: false, width: 140 },
    { field: 'modified', selected: true, width: 140 },
    { field: 'status', selected: false, width: 140 }
  ];

  displayedColumns: string[] = [];

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private ui: UIService,
    public codebook: CodebookService,
    public properties: LocalStorageService, 
    public config: ConfigService,
    private auth: AuthService) { }

  ngOnInit() {
    this.initSelectedColumnsSearch();
    this. initSelectedColumnsEditingRepo();
    this. initSelectedColumnsEditingImport();
    this.api.getUser().subscribe((user: User) => {
      this.user = user;
      this.forename = this.user.forename;
      this.surname = this.user.surname;
    });
    this.searchCols = {};
    for (const col of this.properties.availableSearchColumns) {
      this.searchCols[col] = this.properties.isSearchColEnabled(col);
    }

    if (localStorage.getItem('expandedModels')) {
      this.selectedModels.setValue(JSON.parse(localStorage.getItem('expandedModels')));
    }
    

    if (localStorage.getItem('relatedItemExpanded')) {
      this.relatedItemExpanded = localStorage.getItem('relatedItemExpanded') === 'true';
    }

  }

  changeCodebookTops(type: any) {
    this.dialog.open(PreferredTopsDialogComponent, { data: type });
  }


  profileChanged(): boolean {
    if (!this.user) {
      return false;
    }
    return this.surname && (this.user.forename != this.forename || this.user.surname != this.surname);
  }

  seveProfile() {
    this.state = 'loading';
    this.api.editUser(this.user, this.forename, this.surname).subscribe((user: User) => {
      this.user = user;
      this.forename = this.user.forename;
      this.surname = this.user.surname;
      this.auth.updateUser(user);
      this.state = 'none';
      this.ui.showInfo('snackbar.settings.profile.updated');
    });
  }


  seveSearchCols() {
    for (const col of this.properties.availableSearchColumns) {
      this.properties.setBoolProperty('search.cols.' + col, this.searchCols[col]);
    }
    this.ui.showInfo('snackbar.settings.search.updated');
  }


  changePassword() {
    this.dialog.open(NewPasswordDialogComponent, { 
      width: '550px',
      panelClass: 'app-dialog-new-password'
    });
  }

  changeExpandedModels() {
    localStorage.setItem('expandedModels', JSON.stringify(this.selectedModels.value));
    localStorage.setItem('relatedItemExpanded', JSON.stringify(this.relatedItemExpanded));
  }

  // search
  setColumnsSearch() {
    this.displayedColumns = this.selectedColumnsSearch.filter(c => c.selected).map(c => c.field);
  }

  initSelectedColumnsSearch() {
    const prop = this.properties.getStringProperty('searchColumns');
    if (prop) {
      Object.assign(this.selectedColumnsSearch, JSON.parse(prop));
    }
    this.setColumnsSearch();
  }

  setSelectedColumnsSearch() {
    this.properties.setStringProperty('searchColumns', JSON.stringify(this.selectedColumnsSearch));
    this.initSelectedColumnsSearch();
    this.ui.showInfo('snackbar.settings.searchColumns.updated');
  }

  // repo editing
  selectedColumnsPropNameEditingRepo() {
    this.isRepo = true;
    return this.isRepo ? 'selectedColumnsRepo' : 'selectedColumnsImport';
  }

  setColumnsEditingRepo() {
    this.displayedColumns = this.selectedColumnsEditingRepo.filter(c => c.selected && !(this.isRepo && c.field === 'pageType') && !(this.isRepo && c.field === 'filename') && !(!this.isRepo && c.field === 'label')).map(c => c.field);
  }

  initSelectedColumnsEditingRepo() {
    const prop = this.properties.getStringProperty(this.selectedColumnsPropNameEditingRepo());
    if (prop) {
      Object.assign(this.selectedColumnsEditingRepo, JSON.parse(prop));
    } else {
      if (this.isRepo) {
        this.selectedColumnsEditingRepo.unshift({ field: 'label', selected: true, width: 100 })
      } else {
        this.selectedColumnsEditingRepo.unshift({ field: 'filename', selected: true, width: 100 })
      }
    }
  }

  setSelectedColumnsEditingRepo() {
    this.properties.setStringProperty(this.selectedColumnsPropNameEditingRepo(), JSON.stringify(this.selectedColumnsEditingRepo));
    this.initSelectedColumnsEditingRepo();
    this.ui.showInfo('snackbar.settings.searchColumns.updated');
    this.displayedColumns = this.selectedColumnsEditingRepo.filter(c => c.selected).map(c => c.field);
    //this.table.renderRows();
  }

  // repo import
  selectedColumnsPropNameEditingImport() {
    this.isRepo = false;
    return this.isRepo ? 'selectedColumnsRepo' : 'selectedColumnsImport';
  }

  setColumnsEditingImport() {
    this.displayedColumns = this.selectedColumnsEditingImport.filter(c => c.selected && !(this.isRepo && c.field === 'pageType') && !(this.isRepo && c.field === 'filename') && !(!this.isRepo && c.field === 'label')).map(c => c.field);
  }

  initSelectedColumnsEditingImport() {
    const prop = this.properties.getStringProperty(this.selectedColumnsPropNameEditingImport());
    if (prop) {
      Object.assign(this.selectedColumnsEditingImport, JSON.parse(prop));
    } else {
      if (this.isRepo) {
        this.selectedColumnsEditingImport.unshift({ field: 'label', selected: true, width: 100 })
      } else {
        this.selectedColumnsEditingImport.unshift({ field: 'filename', selected: true, width: 100 })
      }
    }
  }

  setSelectedColumnsEditingImport() {
    this.properties.setStringProperty(this.selectedColumnsPropNameEditingImport(), JSON.stringify(this.selectedColumnsEditingImport));
    this.initSelectedColumnsEditingImport();
    this.ui.showInfo('snackbar.settings.searchColumns.updated');
    this.displayedColumns = this.selectedColumnsEditingImport.filter(c => c.selected).map(c => c.field);
    //this.table.renderRows();
  }
}
