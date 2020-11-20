import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Metadata } from 'src/app/model/metadata.model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  document: Metadata;

  constructor(private route: ActivatedRoute,
              private api: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
    });
  }


}
