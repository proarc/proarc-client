import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AutocompleteComponent } from '../../forms/autocomplete/autocomplete.component';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';


@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    EditorFieldComponent, FieldTextComponent, AutocompleteComponent],
  selector: 'app-editor-classification',
  templateUrl: './editor-classification.component.html',
  styleUrls: ['./editor-classification.component.scss']
})
export class EditorClassificationComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }


}
