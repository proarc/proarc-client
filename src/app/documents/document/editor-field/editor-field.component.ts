import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-editor-field',
  templateUrl: './editor-field.component.html',
  styleUrls: ['./editor-field.component.scss']
})
export class EditorFieldComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;
  @Input() nested: boolean;

  @ContentChild("templateContent") templateContent : TemplateRef<any>;
  @ContentChild("templateMenu") templateMenu : TemplateRef<any>;

  constructor(public help: HelpService) {
  }

  ngOnInit() {
  }



}
