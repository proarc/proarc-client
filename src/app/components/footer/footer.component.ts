import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { versionInfo } from 'src/version-info';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number=new Date().getFullYear();
  backendInfo: any;
  clientInfo: any;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.clientInfo = versionInfo;
    this.api.getInfo().subscribe((info) => {
      this.backendInfo = info;
    },
    (error) => {
    });
  }

}
