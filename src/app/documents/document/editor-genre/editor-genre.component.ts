import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-genre',
  templateUrl: './editor-genre.component.html',
  styleUrls: ['./editor-genre.component.scss']
})
export class EditorGenreComponent implements OnInit {

  @Input() field: ElementField;
  @Input() showGenreSwitch: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  switchChanged(e:any) {
    // this.field.isPeerReviewed = e.value === 'peer-reviewed';
    if (this.field.isPeerReviewed) {
      this.field.getItems()[0].attrs['type'] = 'peer-reviewed';
    } else {
      delete this.field.getItems()[0].attrs['type']
    }
  }

}
