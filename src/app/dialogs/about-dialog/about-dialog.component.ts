
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { versionInfo } from '../../../version-info';
import { Configuration } from '../../shared/configuration';

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

  constructor(public config: Configuration) { }

  ngOnInit() {
    this.clientInfo = versionInfo;
  }


}
