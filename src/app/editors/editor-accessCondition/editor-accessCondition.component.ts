import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { ElementField } from '../../model/mods/elementField.model';
import { AutocompleteComponent } from "../../forms/autocomplete/autocomplete.component";


@Component({
  imports: [CommonModule, TranslateModule,
    EditorFieldComponent, AutocompleteComponent],
  selector: 'app-editor-accessCondition',
  templateUrl: './editor-accessCondition.component.html',
  styleUrls: ['./editor-accessCondition.component.scss']
})
export class EditorAccessConditionComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;

  constructor() {
  }

  ngOnInit() {
  }



}
