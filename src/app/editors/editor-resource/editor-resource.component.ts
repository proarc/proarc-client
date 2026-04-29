
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { ElementField } from '../../model/mods/elementField.model';


@Component({
  imports: [TranslateModule, EditorFieldComponent, FieldDropdownComponent],
  selector: 'app-editor-resource',
  templateUrl: './editor-resource.component.html',
  styleUrls: ['./editor-resource.component.scss']
})
export class EditorResourceComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }

}
