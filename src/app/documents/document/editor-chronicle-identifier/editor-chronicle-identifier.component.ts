import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { ModsElement } from 'src/app/model/mods/element.model';
import { ProArc } from 'src/app/utils/proarc';



@Component({
  selector: 'app-editor-chronicle-identifier',
  templateUrl: './editor-chronicle-identifier.component.html',
  styleUrls: ['./editor-chronicle-identifier.component.scss']
})
export class EditorChronicleIdentifierComponent implements OnInit {

  types: any[] = [];
  codes = ProArc.chronicleIdentifierTypes;

  @Input() field: ElementField;

  constructor(public translator: Translator) {
  }

  ngOnInit() {
    this.translate();
    this.translator.languageChanged.subscribe(() => this.translate());
  }

  translate() {
    this.translator.waitForTranslation().then(() => {
      this.types = [];
      for (const code of this.codes) {
        this.types.push({code: code, name: this.translator.instant('editor.chronicle.identifier.types.' + code)});
      }
    });
  }


}
