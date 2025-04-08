import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldTextareaComponent } from '../../forms/field-textarea/field-textarea.component';
import { ElementField } from '../../model/mods/elementField.model';
import { FieldTextComponent } from "../../forms/field-text/field-text.component";
import { FieldDropdownComponent } from "../../forms/field-dropdown/field-dropdown.component";


@Component({
  imports: [CommonModule, TranslateModule,
    EditorFieldComponent, FieldTextareaComponent, FieldTextComponent, FieldDropdownComponent],
  selector: 'app-editor-note',
  templateUrl: './editor-note.component.html',
  styleUrls: ['./editor-note.component.scss']
})
export class EditorNoteComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }



}
