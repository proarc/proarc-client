import { Component, OnInit } from '@angular/core';
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

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private ui: UIService,
    public codebook: CodebookService,
    public properties: LocalStorageService, 
    public config: ConfigService,
    private auth: AuthService) { }

  ngOnInit() {
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

}
