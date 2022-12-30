
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { versionInfo } from 'src/version-info';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  backendInfo: any;
  clientInfo: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.clientInfo = versionInfo;
    this.api.getInfo().subscribe((info) => {
      this.backendInfo = info;
    },
    (error) => {
    });
  }


}
