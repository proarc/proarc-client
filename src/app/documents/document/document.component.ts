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
      const id = params['id'];
      this.api.getMetadata(id).subscribe((document: Metadata) => {
        this.document = document;
      });
      // const modsRequest = this.apiService.getMods(uuid);
      // const dcRequest = this.apiService.getDc(uuid);
      // const relationsRequest = this.apiService.getChildren(uuid);
      // forkJoin([modsRequest, dcRequest, relationsRequest]).subscribe(
      //   results => {
      //     const mods = results[0].toString();
      //     const dc = results[1].toString();
      //     const relations = Relation.fromJsonArray(results[2]);
      //     this.document = new DigitalDocument(uuid, mods, dc, relations);
      // },
      // error => {
      //     console.log('error', error);
      // });
    });
  }


}
