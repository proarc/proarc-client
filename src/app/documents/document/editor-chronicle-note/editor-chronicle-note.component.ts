import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-chronicle-note',
  templateUrl: './editor-chronicle-note.component.html',
  styleUrls: ['./editor-chronicle-note.component.scss']
})
export class EditorChronicleNoteComponent implements OnInit {

  typeCodes = [ 'public', 'private' ];
  types = [];

  @Input() field: ElementField;

  constructor(public translator: Translator) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.types = [];
      for (const code of this.typeCodes) {
        this.types.push({code: code, name: this.translator.instant('editor.chronicle.note.types.' + code)});
      }
    });
  }


}
