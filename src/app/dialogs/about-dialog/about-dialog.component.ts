
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  backendInfo: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getInfo().subscribe((info) => {
      this.backendInfo = info;
    },
    (error) => {
    });
  }


}
