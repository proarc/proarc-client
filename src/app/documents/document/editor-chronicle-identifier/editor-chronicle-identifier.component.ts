import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';



@Component({
  selector: 'app-editor-chronicle-identifier',
  templateUrl: './editor-chronicle-identifier.component.html',
  styleUrls: ['./editor-chronicle-identifier.component.scss']
})
export class EditorChronicleIdentifierComponent implements OnInit {

  types: any[] = [];
  codes = [ 'signature1', 'signature2', 'officialNumber', 'inventaryNumber', 'OtherNumber' ];

  validTypes: any[] = [];
  validCodes = [ '', 'no', 'yes' ];

  @Input() field: ElementField;

  constructor(public translator: Translator) {
  }

  translate() {
    this.translator.waitForTranslation().then(() => {
      this.types = [];
      for (const code of this.codes) {
        this.types.push({code: code, name: this.translator.instant('editor.chronicle.identifier.types.' + code)});
      }
      this.validTypes = [];
      for (const code of this.validCodes) {
        if (code === '') {
          this.validTypes.push({ code: '', name: '-' });
        } else {
          this.validTypes.push({ code: code, name: this.translator.instant('editor.chronicle.identifier.invalid.' + code)});
        }
      }
    });


  }

  ngOnInit() {
    this.translate();
    this.translator.languageChanged.subscribe(() => this.translate());
    const items = this.field.items;
    for (let i = items.length - 1; i >= 0; i--) {
      const type = items[i].attrs["type"];
      if (type && this.codes.indexOf(type) < 0) {
        items.splice(i, 1);
      }
    }
    if (items.length < 1) {
      this.field.add().switchCollapsed();
    }
  }

}
