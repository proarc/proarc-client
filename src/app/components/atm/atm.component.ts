import { Atm } from './../../model/atm.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.scss']
})
export class AtmComponent implements OnInit {

  state = 'none';
  atm: Atm;

  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.api.getAtm(id).subscribe((atm: Atm) => {
        this.atm = atm;
        this.state = 'success';
        console.log('atm', atm);
      });
    });
  }
}
