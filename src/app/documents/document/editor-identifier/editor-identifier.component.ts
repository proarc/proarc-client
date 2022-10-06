import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { CodebookService } from 'src/app/services/codebook.service';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-editor-identifier',
  templateUrl: './editor-identifier.component.html',
  styleUrls: ['./editor-identifier.component.scss']
})
export class EditorIdentifierComponent implements OnInit {

  @Input() field: ElementField;

  validityOptions = [{code: '', name: 'Platný' }, {code: 'yes', name: 'Neplatný'}];

  constructor(public codebook: CodebookService, private editor: EditorService) {
  }

  ngOnInit() {
  }

  getIdentifiers(): any[] {
    return this.editor.left.isChronicle() ? this.codebook.chronicleIdentifiers :
      this.editor.left.isOldprint() ? this.codebook.oldprintIdentifiers :
      this.editor.left.canContainPdf() ? this.codebook.eDocumentIdentifiers :
        this.codebook.identifiers;
  }

}
