import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-chronicle-language',
  templateUrl: './editor-chronicle-language.component.html',
  styleUrls: ['./editor-chronicle-language.component.scss']
})
export class EditorChronicleLanguageComponent implements OnInit {

  langs: any[] = [];

  topLanguages = ['cze', 'ger', 'lat'];
  otherLanguages = ['eng', 'fre',  'heb',  'ita', 'pol',  'por', 'rus',  'gre',  'slo',  'grc',  'spa',  'mul',  'zxx'];

  @Input() field: ElementField;

  constructor(public translator: Translator) {
    this.translateLanguages();
    translator.languageChanged.subscribe(() => this.translateLanguages());
  }

  translateLanguages() {
    this.translator.waitForTranslation().then(() => {
      this.langs = [];
      const otherLangs = [];
      for (const code of this.topLanguages) {
        this.langs.push({code: code, name: this.translator.instant('lang.' + code)});
      }
      for (const code of this.otherLanguages) {
        otherLangs.push({code: code, name: this.translator.instant('lang.' + code)});
      }
      otherLangs.sort((a: any, b: any): number => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.langs = this.langs.concat(otherLangs);
    });
  }

  ngOnInit() {
  }

}
