import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DigitalDocument } from 'src/app/model/document.model';

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
      console.log('uuid ', uuid);
        this.apiService.getMods(uuid).subscribe((response: Object) => {
          console.log('mods', response);
          this.document = new DigitalDocument(uuid, response.toString());
          this.document.toMods();
      },
      error => {
          console.log('error', error);
      });
    });
  }


}
