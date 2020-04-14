
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CuzkService } from 'src/app/services/cuzk.service';
import { Ruian } from 'src/app/model/ruian.model';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})
export class LocationDialogComponent implements OnInit {

  step = 1;
  state = 'none';
  locations: Ruian[];
  selectedLocation: Ruian;
  query = '';
  address = false;

  hierarchy: Ruian[];

  stack: any[];
  layers: number[];

  counter = 0;

  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    private cuzk: CuzkService) { }

  ngOnInit() {
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
    this.hierarchy = [];
    this.stack = [];
    this.layers = [];
    this.step = 2;
    this.addToHierarchy(this.selectedLocation);
  }


  addToHierarchy(location: Ruian) {
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
          this.addToHierarchy(results[0]);
        }
      });
    } else {
      this.dialogRef.close({locations: this.hierarchy});
    }
  }







}

