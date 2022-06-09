import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor-chronicle-author',
  templateUrl: './editor-chronicle-author.component.html',
  styleUrls: ['./editor-chronicle-author.component.scss']
})
export class EditorChronicleAuthorComponent implements OnInit {
  @Input() field: ElementField;

  private roleCodes = ['ann', 'aut', 'dub', 'edt', 'ill', 'scr', 'trl', 'egr', 'prt', 'oth'];

  public roles: { code: string; name: any; }[] = [];

  constructor(public translator: TranslateService) {
    this.translateCodes();
    translator.onLangChange.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    // this.translator.waitForTranslation().then(() => {
      this.roles = [];
      for (const code of this.roleCodes) {
        this.roles.push({code: code, name: this.translator.instant('role.' + code)});
      }
    // });
  }

}
