import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';



@Component({
  selector: 'app-editor-location',
  templateUrl: './editor-location.component.html',
  styleUrls: ['./editor-location.component.scss']
})
export class EditorLocationComponent implements OnInit {

  locations: any[] = [];

  locationCodes = [
    'BOA001',
    'BOE801',
    'ABA000',
    'ABA001',
    'ABA004',
    'BVE301',
    'CBA001',
    'OLA001',
    'HKA001',
    'ULG001',
    'ABA007',
    'KVG001',
    'ABA013',
    'ABE310',
    'ROE301',
    'ABD103',
    'ABG001',
    'LIA001',
    'KLG001',
    'ZLG001',
    'ABA009',
    'BOE950',
    'UOG505',
    'KTG503',
    'ABE308',
    'ABA010',
    'ABE045',
    'ABC135',
    'ABE323',
    'PNA001',
    'OSA001',
    'OSE309',
    'BOD006',
    'ABD001',
    'ABA006',
    'ABA008',
    'ABE343',
    'ABE459',
    'HOE802',
    'ABA011',
    'BOA002',
    'ABB045',
    'ABE050',
    'ABD005',
    'HBG001',
    'KOE801',
    'OPE301',
    'HKE302',
    'HKG001',
    'JCG001',
    'ABD025',
    'KME301',
    'ZLE302',
    'BOB007',
    'BOE310',
    'ABD020',
    'ABE135',
    'ABE345',
    'ABE370',
    'ABE336',
    'ABD024',
    'ABD134',
    'PNE303',
    'OPD001',
    'JHE301'
  ];


  @Input() field: ElementField;

  constructor(public translator: Translator) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.locations = [];
      for (const code of this.locationCodes) {
        this.locations.push({code: code, name: this.translator.instant('sigla.' + code)});
      }
      this.locations.sort((a: any, b: any): number => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
  }

  ngOnInit() {
  }



}
