
import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-editor-publisher',
  templateUrl: './editor-publisher.component.html',
  styleUrls: ['./editor-publisher.component.scss']
})
export class EditorPublisherComponent implements OnInit {

  @Input() field: ElementField;

  private eventTypeCodes: string[] = ['', 'production', 'publication', 'distribution', 'manufacture', 'copyright'];
  public eventTypes = [];

  private issuanceCodes: string[] = ['', 'monographic', 'single unit', 'multipart monograph',
                                         'continuing', 'serial', 'integrating resource'];
  public issuances = [];

  public qualifierCodes: string[] = ['', 'approximate', 'inferred', 'questionable'];
  public qualifiers = [];

  constructor(public translator: Translator, public help: HelpService) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.eventTypes = [];
      for (const code of this.eventTypeCodes) {
        if (code === '') {
          this.eventTypes.push({ code: '', name: '-' });
        } else {
          this.eventTypes.push({ code: code, name: this.translator.instant('editor.publisher.event_type_code.' + code)});
        }
      }
      this.issuances = [];
      for (const code of this.issuanceCodes) {
        if (code === '') {
          this.issuances.push({ code: '', name: '-' });
        } else {
          this.issuances.push({ code: code, name: this.translator.instant('editor.publisher.issuance_code.' + code)});
        }
      }
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
