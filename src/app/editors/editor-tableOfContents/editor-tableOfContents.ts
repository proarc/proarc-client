import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';


@Component({
  imports: [CommonModule, TranslateModule,
    EditorFieldComponent, FieldTextComponent, FieldDropdownComponent],
  selector: 'app-editor-tableOfContents',
  templateUrl: './editor-tableOfContents.component.html',
  styleUrls: ['./editor-tableOfContents.scss']
})
export class EditorTableOfContentsComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }



}
