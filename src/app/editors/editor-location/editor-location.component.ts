import { Component, OnInit, Input } from '@angular/core';
import { Configuration } from '../../shared/configuration';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, 
    EditorFieldComponent, FieldTextComponent
  ],
  selector: 'app-editor-location',
  templateUrl: './editor-location.component.html',
  styleUrls: ['./editor-location.component.scss']
})
export class EditorLocationComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }


}
