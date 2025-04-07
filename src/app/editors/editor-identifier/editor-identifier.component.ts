import { Component, OnInit, Input } from '@angular/core';

import { Configuration } from '../../shared/configuration';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { FieldCodebookComponent } from "../../forms/field-codebook/field-codebook.component";

@Component({
  imports: [CommonModule, TranslateModule, FormsModule,
    EditorFieldComponent, FieldTextComponent, FieldCodebookComponent],
  selector: 'app-editor-identifier',
  templateUrl: './editor-identifier.component.html',
  styleUrls: ['./editor-identifier.component.scss']
})
export class EditorIdentifierComponent implements OnInit {

  @Input() field: ElementField;
  @Input() model: string;

  validityOptions = [{code: '', name: 'Platný' }, {code: 'yes', name: 'Neplatný'}];

  constructor(private config: Configuration) {
  }

  ngOnInit() {
    
  }

  getIdentifiers(): any[] {
    return this.config.getIdentifiers(this.model);
    // return this.layout.selectedItem.isChronicle() ? this.codebook.chronicleIdentifiers :
    //   this.layout.selectedItem.isOldprint() ? this.codebook.oldprintIdentifiers :
    //   this.layout.selectedItem.canContainPdf() ? this.codebook.eDocumentIdentifiers :
    //     this.codebook.identifiers;
  }

}
