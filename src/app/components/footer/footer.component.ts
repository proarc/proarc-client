import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { versionInfo } from '../../../version-info';
import { ApiService } from '../../services/api.service';
import { Configuration } from '../../shared/configuration';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule
  ],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number=new Date().getFullYear();
  // backendInfo: any;
  clientInfo: any; 

  constructor(public config: Configuration) { }

  ngOnInit(): void {
    this.clientInfo = versionInfo;
    // this.api.getInfo().subscribe((info) => {
    //   this.backendInfo = info;
    // });
  }
}
