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
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { TranslateService } from '@ngx-translate/core';

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

  models: any[];

  @ViewChild('table') table: MatTable<DocumentItem>;
  

  public selectedColumnsEditingRepo = [
    { field: 'label', selected: true, width: 140 },
    { field: 'filename', selected: true, width: 140 },
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
    { field: 'filename', selected: true, width: 140 },
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

  modelForColumns: string;

  constructor(
    private api: ApiService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private ui: UIService,
    public codebook: CodebookService,
    public properties: LocalStorageService,
    public config: ConfigService,
    private auth: AuthService) { }

  ngOnInit() {
    this.properties.getSearchColumns();
    this.initSelectedColumnsEditingImport();
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

    this.models = this.config.allModels;
    this.modelForColumns = this.models[0];
    this.properties.getColsEditingRepo();
  }

  getColumnsForModel() {
    // this.initSelectedColumnsEditingRepo();
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


  setSelectedColumnsSearch() {
    this.properties.setSelectedColumnsSearch();
    this.ui.showInfo('snackbar.settings.searchColumns.updated');
  }

  // repo editing
  selectedColumnsPropNameEditingRepo() {
    this.isRepo = true;
    return this.isRepo ? 'selectedColumnsRepo' : 'selectedColumnsImport';
  }

  setSelectedColumnsEditingRepo() {
    this.properties.setColumnsEditingRepo();
    this.ui.showInfo('snackbar.settings.searchColumns.updated');

  }

  // repo import
  selectedColumnsPropNameEditingImport() {
    this.isRepo = false;
    return this.isRepo ? 'selectedColumnsRepo' : 'selectedColumnsImport';
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
  }

  resetSettings() {

    const data: SimpleDialogData = {
      title: String(this.translator.instant('settings.reset.title')),
      message: String(this.translator.instant('settings.reset.message')),
      btn1: {
        label: String(this.translator.instant('common.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('common.no')),
        value: 'no',
        color: 'default'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        localStorage.clear();
      }
    });


  }
}
