import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-chronicle-genre',
  templateUrl: './editor-chronicle-genre.component.html',
  styleUrls: ['./editor-chronicle-genre.component.scss']
})
export class EditorChronicleGenreComponent implements OnInit {

  contentTypeCodes = [ 'skolniKronika', 'obecniKronika', 'spolecenskaKronika', 'obcanske', 'osadni', 'podnikova', 'vojenske', 'cirkevni', 'unspecified' ];
  contentTypes = [];

  genreCodes = [ 'ukn', 'rkp' ];
  genres = [];

  @Input() field: ElementField;

  constructor(public translator: Translator) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.contentTypes = [];
      for (const code of this.contentTypeCodes) {
        this.contentTypes.push({code: code, name: this.translator.instant('editor.chronicle.genre.content_types.' + code)});
      }
      this.genres = [];
      for (const code of this.genreCodes) {
        this.genres.push({code: code, name: this.translator.instant('editor.chronicle.genre.genres.' + code)});
      }
    });
  }


}
