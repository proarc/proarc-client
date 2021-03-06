import { Component, OnInit } from '@angular/core';
import { Translator } from 'angular-translator';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NewObjectDialogComponent, NewObjectData } from 'src/app/dialogs/new-object-dialog/new-object-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AboutDialogComponent } from 'src/app/dialogs/about-dialog/about-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public translator: Translator,
              public auth: AuthService,
              private config: ConfigService,
              private dialog: MatDialog,
              private properties: LocalStorageService, 
              private router: Router) { }

  ngOnInit() {
  }

  onLanguageChanged(lang: string) {
    localStorage.setItem('lang', lang);
    this.translator.language = lang;
  }

  logout() {
    this.auth.logout();
  }

  onCreateNewObject() {
    const data: NewObjectData = {
      models: this.config.allModels,
      model: this.properties.getStringProperty('search.model', this.config.defaultModel),
      customPid: false
    }
    const dialogRef = this.dialog.open(NewObjectDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['pid']) {
        const pid = result['pid'];
        this.router.navigate(['/document', pid]);
      }
    });
  }

  showAboutDialog() {
    this.dialog.open(AboutDialogComponent);
  }

}
