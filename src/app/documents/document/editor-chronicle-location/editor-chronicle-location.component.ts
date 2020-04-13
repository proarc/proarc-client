import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';



@Component({
  selector: 'app-editor-chronicle-location',
  templateUrl: './editor-chronicle-location.component.html',
  styleUrls: ['./editor-chronicle-location.component.scss']
})
export class EditorChronicleLocationComponent implements OnInit {

  @Input() field: ElementField;

  archives = [
    { code: "226102010", name: "SOkA Jihlava" },
    { code: "226103010", name: "SOkA Pelhřimov" },
    { code: "226101010", name: "SOkA Havlíčkův Brod" },
    { code: "226104010", name: "SOkA Třebíč" },
    { code: "226105010", name: "SOkA Žďár nad Sázavou" }
  ];

  constructor(public translator: Translator) {
    // this.translateCodes();
    // translator.languageChanged.subscribe(() => this.translateCodes());
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      // this.locations = [];
      // for (const code of this.locationCodes) {
      //   this.locations.push({code: code, name: this.translator.instant('sigla.' + code)});
      // }
      // this.locations.sort((a: any, b: any): number => {
      //   if (a.name < b.name) {
      //     return -1;
      //   }
      //   if (a.name > b.name) {
      //     return 1;
      //   }
      //   return 0;
      // });
    });
  }

  ngOnInit() {
  }



}
