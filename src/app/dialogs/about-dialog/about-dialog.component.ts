
import { CommonModule, registerLocaleData } from '@angular/common';
import cs from '@angular/common/locales/cs';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { versionInfo } from '../../../version-info';
import { Configuration } from '../../shared/configuration';

registerLocaleData(cs);

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule
  ],
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  clientInfo: any;

  constructor(public config: Configuration, private translator: TranslateService) { }

  get locale(): string {
    return this.translator.currentLang === 'en' ? 'en-US' : 'cs';
  }

  ngOnInit() {
    this.clientInfo = versionInfo;
  }


}
