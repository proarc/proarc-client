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
    // console.log(this.field.isPeerReviewed)
    if (this.field.isPeerReviewed && this.field.items.length === 1) {
      // this.field.addAsFirst();
    }
    
  }

  ngOnChanges(c: SimpleChanges) {
    this.field.getItems()[0].controls['peer-reviewed'].setValue(this.field.isPeerReviewed);
    this.peerControl.setValue(this.field.isPeerReviewed);
  }

  switchChanged(e: any) {
    // this.field.isPeerReviewed = e.value === 'peer-reviewed';
    if (this.field.isPeerReviewed) {
      //const item = this.field.addAsFirst();
      this.field.getItems()[0].controls['peer-reviewed'].setValue(true);
      this.field.items[0].attrs['type'] = 'peer-reviewed';
      this.field.items[0].setAsDirty();
    } else {
      delete this.field.getItems()[0].attrs['type'];
      //this.field.remove(0);
    }

      setTimeout(() => {
        this.layout.setMetadataResized();
      }, 10);
  }

  typeChanged(e: any, idx: number) {
    // console.log(e, idx)
    if (idx === 0 && e === 'peer-reviewed') {
      // se meni prvni element na 'peer-reviewed'. To jen pomoci switcher
      // pokud mame jen jeden item nic
    } else if (idx === 0 && e !== 'peer-reviewed') {
      // meni na neco jineho prvni element
      // pokud clanek je recenzovan musime pridat item
      if (this.field.isPeerReviewed) {
        const item = this.field.addAsFirst();
        item.controls['peer-reviewed'].setValue(true);
        item.attrs['type'] = 'peer-reviewed';
        item.setAsDirty();
        setTimeout(() => {
          this.layout.setMetadataResized();
        }, 10);
      }
    }
  }

}
