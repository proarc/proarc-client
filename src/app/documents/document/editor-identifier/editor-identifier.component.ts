import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { CodebookService } from 'src/app/services/codebook.service';

@Component({
  selector: 'app-editor-identifier',
  templateUrl: './editor-identifier.component.html',
  styleUrls: ['./editor-identifier.component.scss']
})
export class EditorIdentifierComponent implements OnInit {

  @Input() field: ElementField;
  @Input() type: string;
  @Input() data: any;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }

  getIdentifiers(): any[] {
    return this.type == 'chronicle' ? this.codebook.chronicleIdentifiers : this.codebook.identifiers;
  }

}
