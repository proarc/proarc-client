
import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor-chronicle-publisher',
  templateUrl: './editor-chronicle-publisher.component.html',
  styleUrls: ['./editor-chronicle-publisher.component.scss']
})
export class EditorChroniclePublisherComponent implements OnInit {

  @Input() field: ElementField;

  public qualifierCodes: string[] = ['', 'approximate'];
  public qualifiers: any[] = [];

  constructor(public translator: TranslateService) {
    this.translateCodes();
    translator.onLangChange.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    // this.translator.waitForTranslation().then(() => {
      this.qualifiers = [];
      for (const code of this.qualifierCodes) {
        if (code === '') {
          this.qualifiers.push({ code: '', name: '-' });
        } else {
          this.qualifiers.push({ code: code, name: this.translator.instant('editor.publisher.date_qualifier_code.' + code)});
        }
      }
    // });
  }


}
