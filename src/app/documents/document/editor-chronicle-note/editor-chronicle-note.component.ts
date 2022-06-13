import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor-chronicle-note',
  templateUrl: './editor-chronicle-note.component.html',
  styleUrls: ['./editor-chronicle-note.component.scss']
})
export class EditorChronicleNoteComponent implements OnInit {

  typeCodes = [ 'public', 'private' ];
  types: { code: string; name: any; }[] = [];

  @Input() field: ElementField;

  constructor(public translator: TranslateService) {
    this.translateCodes();
    translator.onLangChange.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    // this.translator.waitForTranslation().then(() => {
      this.types = [];
      for (const code of this.typeCodes) {
        this.types.push({code: code, name: this.translator.instant('editor.chronicle.note.types.' + code)});
      }
    // });
  }


}
