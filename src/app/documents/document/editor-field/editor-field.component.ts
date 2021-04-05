import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HelpDialogComponent } from 'src/app/dialogs/help-dialog/help-dialog.component';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-field',
  templateUrl: './editor-field.component.html',
  styleUrls: ['./editor-field.component.scss']
})
export class EditorFieldComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;
  @Input() usage: string;
  @Input() help: string;
  @Input() nested: boolean;

  @ContentChild("templateContent") templateContent : TemplateRef<any>;
  @ContentChild("templateMenu") templateMenu : TemplateRef<any>;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openHelpDialog() {
    this.dialog.open(HelpDialogComponent, { data: this.help });
  }


}
