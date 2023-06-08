import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-genre',
  templateUrl: './editor-genre.component.html',
  styleUrls: ['./editor-genre.component.scss']
})
export class EditorGenreComponent implements OnInit {

  @Input() field: ElementField;
  @Input() showGenreSwitch: boolean;

  fControl: FormControl;

  constructor() {
  }

  ngOnInit() {
    //console.log(this.field)
    this.fControl = this.field.getItems()[0].getControl('peer-reviewed')
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
