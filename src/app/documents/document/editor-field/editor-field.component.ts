import { Component, OnInit, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HelpDialogComponent } from 'src/app/dialogs/help-dialog/help-dialog.component';
import { ModsElement } from 'src/app/model/mods/element.model';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-field',
  templateUrl: './editor-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-field.component.scss']
})
export class EditorFieldComponent implements OnInit {

  @Input() field: ElementField;
  @Input() nested: boolean;
  @Input() collapsable: boolean = true;
  @Input() showGenreSwitch: boolean;

  @ContentChild("templateContent") templateContent : TemplateRef<any>;
  @ContentChild("templateMenu") templateMenu : TemplateRef<any>;

  validationWarning: string;
  //items: ModsElement[];
  
  constructor(private dialog: MatDialog, private translator: TranslateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    // every time the object changes 
    this.validationWarning = this.field.items.map(item => item.validationWarning).join(',');
    //this.items = this.field.items;
  }

  ngDoCheck() {
    // check for object mutation
    const nc = this.field.items.map(item => item.validationWarning).join(',');
      if (this.validationWarning !== nc) {
        this.validationWarning = nc;
        this.cd.markForCheck();
        //this.items = this.field.items;
      }
  }

  openHelpDialog() {
    this.dialog.open(HelpDialogComponent, { data: this.field.help(this.translator) });
  }

  showByGenre(first: boolean, item: any) {
    return !this.showGenreSwitch || 
           !first || 
           (item.attrs['type'] !== 'peer-reviewed' && (!item.attrs['type'] && item.modsElement['_'] !== 'article' && item.modsElement['_'] !== 'electronic_article')) ;
  }


}
