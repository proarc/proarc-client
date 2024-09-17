import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewObjectDialogComponent, NewObjectData } from 'src/app/dialogs/new-object-dialog/new-object-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AboutDialogComponent } from 'src/app/dialogs/about-dialog/about-dialog.component';
import { NewMetadataDialogComponent } from 'src/app/dialogs/new-metadata-dialog/new-metadata-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  languages = ['cs', 'en', 'cs-en'];
  bgColor: string;
  loggedChecker: any;
  intervalMilis = 10000;

  constructor(public translator: TranslateService,
              public auth: AuthService,
              public config: ConfigService,
              private dialog: MatDialog,
              private properties: LocalStorageService, 
              private router: Router) { }

  ngOnInit() {
    if (this.config.navbarColor) {
      this.bgColor = this.config.navbarColor;
    }
    this.checkLogged();
    // this.loggedChecker = setInterval(() => {
    // }, this.intervalMilis);
  }

  checkLogged() {
    if (this.auth.isLoggedIn()) {
      this.auth.checkLogged().subscribe((res: any) => {
        if (res?.response?.errors) {
          clearInterval(this.loggedChecker);
          // nalert(this.translator.instant('alert.sessionTimeout'));
          this.auth.setLoggedOut();
        } else if(res.state === 'logged') {
          this.auth.remaining = res.remaining;
          this.auth.remainingPercent =  this.auth.remaining * 100.0 / res.maximum;
          if (!this.loggedChecker) {
            this.loggedChecker = setInterval(() => {
              this.checkLogged();
            }, this.intervalMilis);
          }
        } else {
          clearInterval(this.loggedChecker);
          alert(this.translator.instant('alert.sessionTimeout'));
          this.auth.setLoggedOut();
        }
      });
    //} else {
    //  clearInterval(this.loggedChecker);
    }
  }


  onLanguageChanged(lang: string) {
    localStorage.setItem('lang', lang);
    this.translator.use(lang);
  }

  logout() {
    this.auth.logout();
  }

  onCreateNewObject() { 
    const data: NewObjectData = {
      models: this.config.allModels,
      model: this.properties.getStringProperty('search.model', this.config.defaultModel),
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
          this.showMetadataDialog(result.data);
        }
      }
    });
  }

  showMetadataDialog(data: any,) {
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

}
