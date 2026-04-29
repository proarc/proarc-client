import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { Configuration } from '../../shared/configuration';
import { FieldCodebookComponent } from "../../forms/field-codebook/field-codebook.component";

@Component({
  imports: [CommonModule, TranslateModule,
    EditorFieldComponent, FieldTextComponent, FieldDropdownComponent, FieldCodebookComponent],
  selector: 'app-editor-recordInfo',
  templateUrl: './editor-recordInfo.component.html',
  styleUrls: ['./editor-recordInfo.scss']
})
export class EditorRecordInfoComponent implements OnInit {

  @Input() field: ElementField;

  constructor(public codebook: Configuration) {
  }

  ngOnInit() {
  }



}
