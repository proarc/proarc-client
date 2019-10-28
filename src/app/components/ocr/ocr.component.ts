import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Ocr } from 'src/app/model/ocr.model';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.scss']
})
export class OcrComponent implements OnInit {

  state = 'none';
  ocr: Ocr;

  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.state = 'loading';
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.api.getOcr(id).subscribe((ocr: Ocr) => {
        this.ocr = ocr;
        this.state = 'success';
      }, () => {
        this.state = 'failure';
      });
    });
  }

  updateOcr() {
    this.state = 'loading';
    this.api.editOcr(this.ocr).subscribe((ocr: Ocr) => {
      this.ocr = ocr;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
