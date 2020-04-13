import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-chronicle-author',
  templateUrl: './editor-chronicle-author.component.html',
  styleUrls: ['./editor-chronicle-author.component.scss']
})
export class EditorChronicleAuthorComponent implements OnInit {
  @Input() field: ElementField;

  private roleCodes = ['ann', 'aut', 'dub', 'edt', 'ill', 'scr', 'trl', 'egr', 'prt', 'oth'];

  public roles = [];

  constructor(public translator: Translator) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.roles = [];
      for (const code of this.roleCodes) {
        this.roles.push({code: code, name: this.translator.instant('role.' + code)});
      }
    });
  }

}
