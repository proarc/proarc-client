import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DigitalDocument } from 'src/app/model/document.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  document: DigitalDocument;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const uuid = params['id'];
      const modsRequest = this.apiService.getMods(uuid);
      const dcRequest = this.apiService.getDc(uuid);
      forkJoin([modsRequest, dcRequest]).subscribe(
        results => {
          const mods = results[0].toString();
          const dc = results[1].toString();
          this.document = new DigitalDocument(uuid, mods, dc);
      },
      error => {
          console.log('error', error);
      });
    });
  }


}
