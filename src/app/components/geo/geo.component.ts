import { Component, OnInit, Input } from '@angular/core';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {

  @Input() document: Metadata;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  save() {
    this.api.editMods(this.document).subscribe(result => {
      console.log('mods saved', result);
    }, () => {
    });
  }


}
