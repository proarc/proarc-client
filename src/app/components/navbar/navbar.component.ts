import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IsActiveMatchOptions, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { NewObjectDialogComponent, NewObjectData } from 'src/app/dialogs/new-object-dialog/new-object-dialog.component';
// import { AboutDialogComponent } from 'src/app/dialogs/about-dialog/about-dialog.component';
// import { NewMetadataDialogComponent } from 'src/app/dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { AboutDialogComponent } from '../../dialogs/about-dialog/about-dialog.component';
import { NewObjectData, NewObjectDialogComponent } from '../../dialogs/new-object-dialog/new-object-dialog.component';
import { NewMetadataDialogComponent } from '../../dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from '../../model/documentItem.model';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule,
    MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatTooltipModule
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  languages = ['cs', 'en', 'cs-en'];
  sub: Subscription;
  isAkubra: boolean;
  state = signal<string>('');

  constructor(public translator: TranslateService,
    public auth: AuthService,
    public config: Configuration,
    private dialog: MatDialog,
    private settings: UserSettings,
    private settingsService: UserSettingsService,
    private api: ApiService,
    private ui: UIService,
    private router: Router) { }

  ngOnInit() {
    this.isAkubra = this.config.info.storage === 'Akubra';
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }


  onLanguageChanged(lang: string) {
    // localStorage.setItem('lang', lang);
    this.settings.lang = lang;
    this.settingsService.save();
    this.translator.use(lang);
  }

  logout() {
    this.auth.logout();
  }

  onCreateNewObject() {
    const data: NewObjectData = {
      models: this.config.models,
      model: this.settings.searchModel,
      customPid: false,
      fromNavbar: true
    }
    const dialogRef = this.dialog.open(NewObjectDialogComponent, {
      data: data,
      width: '680px',
      panelClass: 'app-dialog-new-bject'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['pid']) {
        if (result.isMultiple) {
          const pid = result['pid'];
          this.router.navigate(['/repository', pid]);
        } else {
          this.showMetadataDialog(result.data[0]);
        }
      }
    });
  }

  showMetadataDialog(data: any) {
    const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
      disableClose: true,
      height: '90%',
      width: '680px',
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.item) {
        const pid = res.item['pid'];
        const p: IsActiveMatchOptions = {
          matrixParams: 'subset',
          queryParams: 'ignored',
          paths: 'subset',
          fragment: 'ignored'
        };
        if (res.gotoEdit) {
          this.router.navigate(['/repository', pid]);
        }
      } else {

      }
    });
  }

  showAboutDialog() {
    this.dialog.open(AboutDialogComponent);
  }

  reindex() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Index Proarc')),
      message: String(this.translator.instant('Opravdu chcete spustit index?')),
      alertClass: 'app-message',
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
        this.state.update(() => 'loading');
        this.api.indexer().subscribe((response: any) => {
          if (response.response.errors) {
            this.state.update(() => 'error');
            this.ui.showErrorDialogFromObject(response.response.errors);
          } else {
            this.state.update(() => 'success');
            this.ui.showInfoSnackBar(this.translator.instant('index Proarc spusten'))
          }
        });
      }
    });
  }

  indexerParents() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Index nadřazených objektů')),
      message: String(this.translator.instant('Opravdu chcete spustit indexace do SOLR nadřazených objektů?')),
      alertClass: 'app-message',
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
        this.state.update(() => 'loading');
        this.api.indexParents().subscribe((response: any) => {
          if (response.response.errors) {
            this.state.update(() => 'error');
            this.ui.showErrorDialogFromObject(response.response.errors);
          } else {
            this.state.update(() => 'success');
            this.ui.showInfoSnackBar(this.translator.instant('index Proarc spusten'))
          }
        });
      }
    });
  }

  purgeObjects() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Smazat vše, co má příznak smazáno')),
      message: String(this.translator.instant('Opravdu smazat vše, co má příznak smazáno?')),
      alertClass: 'app-message',
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
        this.state.update(() => 'loading');
        this.api.purgeObjects().subscribe((response: any) => {
          if (response.response.errors) {
            this.state.update(() => 'error');
            this.ui.showErrorDialogFromObject(response.response.errors);
          } else {
            this.state.update(() => 'success');
            this.ui.showInfoSnackBar(this.translator.instant('purge objects spusten'))
          }
        });
      }
    });
  }

  updateNdkPage() {
    const data: SimpleDialogData = {
      title: String(this.translator.instant('Opravit typ stran')),
      message: String(this.translator.instant('Opravdu chcete opravit typ stran?')),
      alertClass: 'app-message',
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
        this.state.update(() => 'loading');
        this.api.updateNdkPage().subscribe((response: any) => {
          if (response.response.errors) {
            this.state.update(() => 'error');
            this.ui.showErrorDialogFromObject(response.response.errors);
          } else {
            this.state.update(() => 'success');
            this.ui.showInfoSnackBar(this.translator.instant('index Proarc spusten'))
          }
        });
      }
    });
  }

}
