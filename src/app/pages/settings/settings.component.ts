import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormsModule } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { DocumentItem } from '../../model/documentItem.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../model/user.model';
import { ApiService } from '../../services/api.service';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { Configuration } from '../../shared/configuration';
import { UIService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { NewPasswordDialogComponent } from '../../dialogs/new-password-dialog/new-password-dialog.component';
import { PreferredTopsDialogComponent } from '../../dialogs/preferred-tops-dialog/preferred-tops-dialog.component';

@Component({
  standalone: true,
  imports: [TranslateModule, FormsModule, DragDropModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatInputModule, MatDividerModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule],
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  view: string = 'localSettings';

  state = 'none';
  user: User | null;

  appearance: boolean;

  forename: string;
  surname: string;

  // searchCols: any;
  selectedModels = new FormControl('');

  // relatedItemExpanded: boolean;
  models: any[];

  @ViewChild('table') table: MatTable<DocumentItem>;


  modelForColumns: string;
  // colsEditModeParent: boolean = true;
  columnsSearchTree: any;
  // searchExpandTree: boolean = true;

  curSettings: UserSettings;

  constructor(
    private api: ApiService,
    private translator: TranslateService,
    private dialog: MatDialog,
    private ui: UIService,
    // public codebook: CodebookService,
    // public settings: UserSettings,
    public settingsService: UserSettingsService,
    public config: Configuration,
    private auth: AuthService) { }

  ngOnInit() {
    this.curSettings = this.settingsService.cloneSettings();
    this.appearance = this.curSettings.appearance === 'outline';
    this.api.getUser().subscribe((user: User) => {
      this.user = user;
      this.forename = this.user.forename;
      this.surname = this.user.surname;
    });

    this.models = this.config.models;
    this.modelForColumns = this.models[0];
  }

  save() {
    this.settingsService.setSettings(this.curSettings);
  }
    setAppearance() {
      this.curSettings.appearance = this.appearance ? 'outline'  : 'fill';
    }

  getColumnsForModel() {
    // this.initSelectedColumnsEditingRepo();
  }

  changeCodebookTops(prefix: string, listName: string, conf: string[], expanded: boolean = false) {
    const top: string[] = this.curSettings[listName];
    const dialogRef = this.dialog.open(PreferredTopsDialogComponent, {
      data: { prefix, top, conf, expanded, relatedItemExpanded: this.curSettings.relatedItemExpanded }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.curSettings[listName] = [];
        result.top.forEach((r: string) => {
          this.curSettings[listName].push(r);
        });
        this.curSettings.relatedItemExpanded = result.relatedItemExpanded;
        this.settingsService.setSettings(this.curSettings);
      }
    });
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

  changePassword() {
    this.dialog.open(NewPasswordDialogComponent, {
      width: '550px',
      panelClass: 'app-dialog-new-password'
    });
  }

  resetOne(s: string) {
    this.settingsService.resetOne(s);
    this.curSettings = this.settingsService.cloneSettings();
  }

  resetRepo() {
    this.settingsService.resetRepo();
    this.curSettings = this.settingsService.cloneSettings();
  }

  resetSettings() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.resetLocalSettings.title')),
      message: String(this.translator.instant('dialog.resetLocalSettings.message')),
      alertClass: 'app-warn',
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
        this.settingsService.reset();
        this.settingsService.save(false);
        this.curSettings = this.settingsService.cloneSettings();
        this.ui.showInfoSnackBar(this.translator.instant('snackbar.settings.resetLocalSettings.success'));
      }
    });
  }

  changeView(view: string) {
    this.view = view;
  }

  drop(event: CdkDragDrop<string[]>, list: any[]) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }
}
