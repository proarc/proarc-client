import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number=new Date().getFullYear();
  backendInfo: any;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getInfo().subscribe((info) => {
      this.backendInfo = info;
    },
    (error) => {
    });
  }

}
