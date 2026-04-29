
import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { ElementField } from '../../model/mods/elementField.model';
import { Configuration } from '../../shared/configuration';
import { FieldCodebookComponent } from '../../forms/field-codebook/field-codebook.component';
import { FieldTextareaComponent } from '../../forms/field-textarea/field-textarea.component';
import { FieldTextComponent } from "../../forms/field-text/field-text.component";
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, EditorFieldComponent, FieldCodebookComponent, FieldTextareaComponent],
  selector: 'app-editor-abstract',
  templateUrl: './editor-abstract.component.html',
  styleUrls: ['./editor-abstract.component.scss']
})
export class EditorAbstractComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;

  constructor(public config: Configuration, public settings: UserSettings) {
  }

  ngOnInit() {
  }



}
