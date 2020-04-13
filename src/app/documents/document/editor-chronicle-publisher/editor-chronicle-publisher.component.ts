
import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-chronicle-publisher',
  templateUrl: './editor-chronicle-publisher.component.html',
  styleUrls: ['./editor-chronicle-publisher.component.scss']
})
export class EditorChroniclePublisherComponent implements OnInit {

  @Input() field: ElementField;

  public qualifierCodes: string[] = ['', 'approximate'];
  public qualifiers = [];

  constructor(public translator: Translator) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.qualifiers = [];
      for (const code of this.qualifierCodes) {
        if (code === '') {
          this.qualifiers.push({ code: '', name: '-' });
        } else {
          this.qualifiers.push({ code: code, name: this.translator.instant('editor.publisher.date_qualifier_code.' + code)});
        }
      }
    });
  }


}
