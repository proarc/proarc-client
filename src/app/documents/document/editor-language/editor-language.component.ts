import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { CodebookService } from 'src/app/services/codebook.service';

@Component({
  selector: 'app-editor-language',
  templateUrl: './editor-language.component.html',
  styleUrls: ['./editor-language.component.scss']
})
export class EditorLanguageComponent implements OnInit {

  @Input() field: ElementField;
  @Input() data: any;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }

}
