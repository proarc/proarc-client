import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HelpDialogComponent } from 'src/app/dialogs/help-dialog/help-dialog.component';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-field',
  templateUrl: './editor-field.component.html',
  styleUrls: ['./editor-field.component.scss']
})
export class EditorFieldComponent implements OnInit {


  @Input() field: ElementField;
  @Input() nested: boolean;
  @Input() collapsable: boolean = true;

  @ContentChild("templateContent") templateContent : TemplateRef<any>;
  @ContentChild("templateMenu") templateMenu : TemplateRef<any>;

  constructor(private dialog: MatDialog, private translator: TranslateService) {
  }

  ngOnInit() {
  }

  openHelpDialog() {
    this.dialog.open(HelpDialogComponent, { data: this.field.help(this.translator) });
  }


}
