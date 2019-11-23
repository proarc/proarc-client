import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';



@Component({
  selector: 'app-editor-identifier',
  templateUrl: './editor-identifier.component.html',
  styleUrls: ['./editor-identifier.component.scss']
})
export class EditorIdentifierComponent implements OnInit {

  types: any[] = [];

  codes = [ 'barcode', 'issn', 'isbn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici', 'id', 'localId'
               ];


  @Input() field: ElementField;

  constructor(public translator: Translator) {
    this.translate();
    translator.languageChanged.subscribe(() => this.translate());
  }

  translate() {
    this.translator.waitForTranslation().then(() => {
      this.types = [];
      for (const code of this.codes) {
        this.types.push({code: code, name: this.translator.instant('identifier.' + code)});
      }
      this.types.sort((a: any, b: any): number => {
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
    console.log('field', this.field);
  }



}
