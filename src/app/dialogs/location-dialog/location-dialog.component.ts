
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CuzkService } from 'src/app/services/cuzk.service';
import { Ruian } from 'src/app/model/ruian.model';
import * as L from 'leaflet';
import { OsmService } from 'src/app/services/osm.service';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from '../simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';


@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})
export class LocationDialogComponent implements OnInit, AfterViewInit {

  private map: any;

  osmLocation: any;

  state = 'none';
  locations: Ruian[];
  selectedLocation: Ruian;
  query = '';
  address = false;

  hierarchy: Ruian[];

  stack: any[];
  layers: number[];

  counter = 0;
  lock = false;

  lookup = false;
  mapSelectionMode = false;

  lat: number;
  lng: number;

  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    private osm: OsmService,
    private dialog: MatDialog,
    private translator: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cuzk: CuzkService) { 
      this.mapSelectionMode = data && data.map;
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', {
      center: [ 49.396589, 15.588859 ],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    

    this.map.on('click', (e: { latlng: { lat: any; lng: any; }; }) => {
      if (this.lookup) {
        return;
      }
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // console.log('lat: ' + lat + ', lng: ' + lng);
      this.osm.findAddress(lat, lng).subscribe((result) => {
        // console.log('result', result);
        this.onOsmLocationSelected(result, lat, lng);
      });
    });
    tiles.addTo(this.map);
  }

  onOsmLocationSelected(location: any, lat: number, lng: number) {
    // const address = location.address;
    // if (address && address.house_number && (address.road || address.pedestrian)) {
      this.osmLocation = location;
      this.lat = lat;
      this.lng = lng;
    // } else {
      // this.osmLocation = null;
    // }
  } 

  cancleMapLocation() {
    this.dialogRef.close();
  }

  useMapLocation() {
    this.lookup = true;
    const address = this.osmLocation.address;
    let postcode = address.postcode || '';
    let city = address.city || '';
    postcode = postcode.replace(/ /, '');
    const road = address.road;
    const houseNumber = address.house_number;
    const pedestrian = address.pedestrian;
      let name = '';
      if (road) {
        name = road;
      } else if (pedestrian) {
        name = pedestrian;
      }
      let rq;
      let type = 0;
      if (houseNumber) {
        type = 1;
        rq = this.cuzk.searchAddresses(`${name} ${houseNumber}`);
      } else if (road) {
        type = 2;
        rq = this.cuzk.searchRoad(road);
      } else {
        this.osmLocationNotFound();
      }
      rq.subscribe((results: Ruian[]) => {
      if (results.length == 0) {
        this.osmLocationNotFound();
        return;
      }
      if (results.length == 1) {
        this.useLocationFromOsm(results[0]);
        return;
      }
      for (const location of results) {
        if (type == 1) {
          if (location.value.toLowerCase().indexOf(postcode) >= 0) {
            this.useLocationFromOsm(location);
            return;
          }
        } else if (type == 2) {
          if (location.attributes.ulice.toLowerCase().indexOf(city.toLowerCase()) >= 0) {
            this.useLocationFromOsm(location);
            return;
          }
        }
      }
      this.osmLocationNotFound();
    });
  }

  private osmLocationNotFound() {
    this.lookup = false;
    // this.translator.waitForTranslation().then(() => {
      const data: SimpleDialogData = {
        title: String(this.translator.instant('editor.geo.map.not_found')),
        message: String(this.translator.instant('editor.geo.map.not_found_message')),
        btn1: {
          label: String(this.translator.instant('common.close')),
          value: 'no',
          color: 'default'
        },
        btn2: {
          label: String(this.translator.instant('editor.geo.map.use_coordinates')),
          value: 'yes',
          color: 'primary'
        }
      };
      const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'yes') {
          this.dialogRef.close({locations: null, lat: this.lat, lng: this.lng});
        }
      });


    // });
  }

  private useLocationFromOsm(location: Ruian) {
    this.state = 'saving';
    this.fetchHierarchy(location, true);
  }


  search(query: string) {
    if (!query || (this.address && query.length < 6) || (!this.address && query.length < 2)) {
      return;
    }
    this.state = 'loading';
    if (this.address) {
      const parts = query.split(" ");
      this.cuzk.searchAddresses(parts[0]).subscribe((results: Ruian[]) => {
        if (parts.length > 1) {
          for (let i = results.length - 1; i >= 0; i--) {
            const label = results[i].label.toLowerCase();
            for (let j = 1; j < parts.length; j++) {
              const p = parts[j].toLowerCase();
              if (label.indexOf(p) < 0) {
                results.splice(i, 1);
                break;
              }
            }
          }
        }
        this.handleResults(results);
      })
    } else {
      this.cuzk.search(query).subscribe((results: Ruian[]) => {
        this.handleResults(results);
      })
    }
  }

  onEnter() {
    this.search(this.query);
  }

  onChange(value: string) {
    if (!this.address && value && value.length > 3) {
      this.search(value);
    }
  }

  handleResults(results: Ruian[]) {
    this.locations = results;
    this.locations.sort((a: any, b: any): number => {
      if (a.layerId > b.layerId) {
        return -1;
      }
      if (a.layerId < b.layerId) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    this.state = 'success';
  }

  onSave() {
    this.state = 'saving';
    this.fetchHierarchy(this.selectedLocation, true);
  }


  showInfo(location: Ruian) {
    if (this.lock || location.extendedLabel) {
      return;
    }
    this.lock = true;
    this.fetchHierarchy(location, false);
  }

  fetchHierarchy(from: Ruian, finish: boolean) {
    this.hierarchy = [];
    this.stack = [];
    this.layers = [];
    this.addToHierarchy(from, finish);
  }

  addToHierarchy(location: Ruian, finish: boolean) {
    for (const p of location.parents) {
      if (this.layers.indexOf(p.layer) < 0) {
        this.layers.push(p.layer);
        this.stack.push(p);
      }
    }
    this.hierarchy.push(location);
    if (this.stack.length > 0) {
      const p = this.stack.shift();
      this.cuzk.searchByCode(p.code, p.layer).subscribe((results: Ruian[]) => {
        if (results && results[0]) {
          this.addToHierarchy(results[0], finish);
        }
      });
    } else {
      if (finish) {
        this.dialogRef.close({locations: this.hierarchy, lat: this.lat, lng: this.lng});
      } else {
        this.buildExtendedLabelFromHierarchy();
      }
    }
  }



  buildExtendedLabelFromHierarchy() {
    const location = this.hierarchy[0];
    this.hierarchy.sort((a: any, b: any): number => {
      if (a.layerId < b.layerId) {
        return -1;
      }
      if (a.layerId > b.layerId) {
        return 1;
      }
      return 0;
    });
    location.extendedLabel = this.hierarchy.map(a => a.label).join(', ');
    let sameLocation: Ruian;
    for (const l of this.locations) {
      if (!l.extendedLabel && l.label == location.label) {
        sameLocation = l;
        break;
      }
    }
    this.lock = false;
    if (sameLocation) {
      this.showInfo(sameLocation);
    } 
  }




}

