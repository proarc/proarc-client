import { Component, Input } from '@angular/core';
import { ModsElement } from '../../model/mods/element.model';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';

@Component({
  selector: 'app-editor-name-part',
  imports: [EditorFieldComponent, FieldDropdownComponent, FieldTextComponent],
  templateUrl: './editor-name-part.component.html',
  styleUrl: './editor-name-part.component.scss',
})
export class EditorNamePartComponent {
  @Input() item: any;
}
