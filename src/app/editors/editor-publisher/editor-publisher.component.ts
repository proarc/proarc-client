
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { AutocompleteComponent } from "../../forms/autocomplete/autocomplete.component";

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatTooltipModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    EditorFieldComponent, FieldDropdownComponent, FieldTextComponent, AutocompleteComponent],
  selector: 'app-editor-publisher',
  templateUrl: './editor-publisher.component.html',
  styleUrls: ['./editor-publisher.component.scss']
})
export class EditorPublisherComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }

}
