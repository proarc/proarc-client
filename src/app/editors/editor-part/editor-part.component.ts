import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { FieldDropdownComponent } from "../../forms/field-dropdown/field-dropdown.component";

@Component({
  imports: [CommonModule, TranslateModule,
    EditorFieldComponent, FieldTextComponent, FieldDropdownComponent],
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {

  @Input() field: ElementField;

  constructor() { }

  ngOnInit() {
  }

}
