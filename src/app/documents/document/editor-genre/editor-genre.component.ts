import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-genre',
  templateUrl: './editor-genre.component.html',
  styleUrls: ['./editor-genre.component.scss']
})
export class EditorGenreComponent implements OnInit {

  @Input() field: ElementField;
  @Input() showGenreSwitch: boolean;

  peerControl = new FormControl();

  constructor(private layout: LayoutService) {
  }

  ngOnInit() {
    // console.log(this.field)
    // this.field.getItems()[0].addControl('peer-reviewed')
    // console.log(this.field.isPeerReviewed)
  }

  ngOnChanges(c: SimpleChanges) {
    // console.log(this.field.getItems()[0].controls['peer-reviewed'])
    // console.log(this.field.isPeerReviewed) 
    this.field.getItems()[0].controls['peer-reviewed'].setValue(this.field.isPeerReviewed);
    this.peerControl.setValue(this.field.isPeerReviewed);
  }

  switchChanged(e: any) {
    // this.field.isPeerReviewed = e.value === 'peer-reviewed';
    if (this.field.isPeerReviewed) {
      const item = this.field.addAsFirst();
      this.field.getItems()[0].controls['peer-reviewed'].setValue(true);
      this.field.items[0].attrs['type'] = 'peer-reviewed';
      this.field.items[0].setAsDirty();
    } else {
      delete this.field.getItems()[0].attrs['type'];
      this.field.remove(0);
    }

      setTimeout(() => {
        this.layout.setMetadataResized();
      }, 10);
  }

}
