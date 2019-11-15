import { Component, OnInit, Input } from '@angular/core';
import { DigitalDocument } from 'src/app/model/document.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {

  @Input() document: DigitalDocument;

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
