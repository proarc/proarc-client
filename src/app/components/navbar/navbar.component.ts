import { Component, OnInit } from '@angular/core';
import { Translator } from 'angular-translator';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NewObjectDialogComponent, NewObjectData } from 'src/app/dialogs/new-object-dialog/new-object-dialog.component';
import { ProArc } from 'src/app/utils/proarc';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public translator: Translator,
              public auth: AuthService,
              private dialog: MatDialog,
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
      model: ProArc.models[0],
      customPid: false
    }
    const dialogRef = this.dialog.open(NewObjectDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['pid']) {
        const pid = result['pid'];
        console.log('object created, new pid: ', pid);
        this.router.navigate(['/document', pid]);
      }
    });
  }

}
