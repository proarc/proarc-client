import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { MatDialog } from '@angular/material/dialog';
import { LocationDialogComponent } from 'src/app/dialogs/location-dialog/location-dialog.component';
import { Ruian } from 'src/app/model/ruian.model';
import { ModsGeo } from 'src/app/model/mods/geo.model';
import { Coordinates } from 'src/app/utils/coordinates';

@Component({
  selector: 'app-editor-subject-geo',
  templateUrl: './editor-subject-geo.component.html',
  styleUrls: ['./editor-subject-geo.component.scss']
})
export class EditorSubjectGeoComponent implements OnInit {
  @Input() field: ElementField;

  public types: string[] = ['geo:origin', 'geo:storage', 'geo:area'];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onSearch(location: ModsGeo, map = false) {
    const dialogRef = this.dialog.open(LocationDialogComponent, { data: { map: map }});
    dialogRef.afterClosed().subscribe(result => {
      if (result && ((result['lat'] && result['lng']) || result['locations'])) {
        location.clear();
      }
      if (result && result['lat'] && result['lng']) {
        this.updateCoordinated(location, result['lat'], result['lng']);
      }
      if (result && result['locations']) {
        for (const ruian of result['locations'] as Ruian[]) {
          this.update(location, ruian);
        }
      }
      if (!location.attrs['authority']) {
        location.attrs['authority'] = this.types[0];
      }
    });
  }

  updateCoordinated(location: ModsGeo, lat: number, lng: number) {
    if (!lat || !lng) {
      return;
    }
    location.coordinates['_'] = Coordinates.latLngToDegrees(lat, lng);
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
    }
  }

  updateFiled(location: ModsGeo, field: string, ruian: Ruian) {
    location[field as keyof ModsGeo]['_'] = ruian.value;
    location[field + '_code' as keyof ModsGeo]['_'] = ruian.code;
  }






}
