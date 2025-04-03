import { Component, OnInit } from '@angular/core';
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
import { UserSettings } from '../../shared/user-settings';
import { AboutDialogComponent } from '../../dialogs/about-dialog/about-dialog.component';

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

  constructor(public translator: TranslateService,
              public auth: AuthService,
              public config: Configuration,
              private dialog: MatDialog,
              private settings: UserSettings, 
              private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
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
    // const data: NewObjectData = {
    //   models: this.config.models,
    //   model: this.settings.searchModel,
    //   customPid: false,
    //   fromNavbar: true
    // }
    // const dialogRef = this.dialog.open(NewObjectDialogComponent, { 
    //   data: data,
    //   width: '680px',
    //   panelClass: 'app-dialog-new-bject'
    //  });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result['pid']) {
    //     if (result.isMultiple) {
    //       const pid = result['pid'];
    //       this.router.navigate(['/repository', pid]);
    //     } else {
    //       this.showMetadataDialog(result.data);
    //     }
    //   }
    // });
  }

  showMetadataDialog(data: any,) {
  //   const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
  //      disableClose: true, 
  //      height: '90%',
  //      width: '680px',
  //      data: data 
  //     });
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res?.item) {
  //       const pid = res.item['pid'];
  //       const p: IsActiveMatchOptions = {
  //         matrixParams: 'subset',
  //         queryParams: 'ignored',
  //         paths: 'subset',
  //         fragment: 'ignored'
  //       };        
  //       if (res.gotoEdit) {
  //         this.router.navigate(['/repository', pid]);
  //       }
  //     } else {
        
  //     }
  //   });
  }

  showAboutDialog() {
    this.dialog.open(AboutDialogComponent);
  }

}
