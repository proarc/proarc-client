import { Component, OnInit, Input } from '@angular/core';

import { Configuration } from '../../shared/configuration';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { FieldCodebookComponent } from "../../forms/field-codebook/field-codebook.component";
import { UserSettingsService } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, EditorFieldComponent, FieldTextComponent, FieldCodebookComponent],
  selector: 'app-editor-identifier',
  templateUrl: './editor-identifier.component.html',
  styleUrls: ['./editor-identifier.component.scss']
})
export class EditorIdentifierComponent implements OnInit {

  @Input() field: ElementField;
  @Input() model: string;

  // validityOptions = [{code: '', name: 'Platný' }, {code: 'yes', name: 'Neplatný'}];
  validityOptions = ['', 'yes'];

  constructor(private config: Configuration, public settingsService: UserSettingsService) {
  }

  ngOnInit() {
    
  }

  getIdentifiers(): any[] {
    return this.settingsService.getIdentifiers(this.model);
  }

}
