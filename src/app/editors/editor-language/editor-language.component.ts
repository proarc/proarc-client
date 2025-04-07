import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FieldCodebookComponent } from '../../forms/field-codebook/field-codebook.component';
import { ElementField } from '../../model/mods/elementField.model';
import { Configuration } from '../../shared/configuration';
import { FieldDropdownComponent } from "../../forms/field-dropdown/field-dropdown.component";
import { EditorFieldComponent } from "../../forms/editor-field/editor-field.component";

@Component({
  imports: [CommonModule, TranslateModule,
    FieldCodebookComponent, FieldDropdownComponent, EditorFieldComponent],
  selector: 'app-editor-language',
  templateUrl: './editor-language.component.html',
  styleUrls: ['./editor-language.component.scss']
})
export class EditorLanguageComponent implements OnInit {

  @Input() field: ElementField;

  constructor(public config: Configuration) {
  }

  ngOnInit() {
  }

}
