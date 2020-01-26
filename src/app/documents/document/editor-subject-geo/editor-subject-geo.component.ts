import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { MatDialog } from '@angular/material';
import { LocationDialogComponent } from 'src/app/dialogs/location-dialog/location-dialog.component';
import { ModsElement } from 'src/app/model/mods/element.model';
import { Ruian } from 'src/app/model/ruian.model';
import { ModsGeo } from 'src/app/model/mods/geo.model';

@Component({
  selector: 'app-editor-subject-geo',
  templateUrl: './editor-subject-geo.component.html',
  styleUrls: ['./editor-subject-geo.component.scss']
})
export class EditorSubjectGeoComponent implements OnInit {
  @Input() field: ElementField;

  private types: string[] = ['geo:origin', 'geo:storage', 'geo:area'];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onSearch(location: ModsGeo) {
    console.log('loc', location);
    const dialogRef = this.dialog.open(LocationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result && result['locations']) {
        location.clear();
        for (const ruian of result['locations'] as Ruian[]) {
          console.log('update');
          this.update(location, ruian);
        }
      }
      // const ruian = result.location as Ruian;
      // if (ruian.layerId === 4) {
      //   location.ulice["_"] = ruian.value;
      //   location.ulice_code["_"] = ruian.code;
      // }
    });
  }


  update(location: ModsGeo, ruian: Ruian) {
    switch (ruian.layerId) {
      case 1: this.updateFiled(location, 'adresni_misto', ruian); break;
      case 4: this.updateFiled(location, 'ulice', ruian); break;
      case 7: this.updateFiled(location, 'katastralni_uzemi', ruian); break;
      case 11: this.updateFiled(location, 'cast_obce', ruian); break;
      case 12: this.updateFiled(location, 'obec', ruian); break;
      case 13: this.updateFiled(location, 'pou', ruian); break;
      case 14: this.updateFiled(location, 'orp', ruian); break;
      case 15: this.updateFiled(location, 'okres', ruian); break;
      case 16: this.updateFiled(location, 'vusc', ruian); break;
      case 17: this.updateFiled(location, 'region_soudrznosti', ruian); break;
      case 18: this.updateFiled(location, 'kraj_1960', ruian); break;
      case 19: this.updateFiled(location, 'stat', ruian); break;
      //   location.ulice_code["_"] = ruian.code;
    }
  }

  updateFiled(location: ModsGeo, field: string, ruian: Ruian) {
    console.log('updateFiled?', field);
    console.log('updateFiled?', ruian.value);

    // location.stat = 'hehe';// ruian.value;

    location[field]['_'] = ruian.value;
    location[field + '_code']['_'] = ruian.code;
  }



}
