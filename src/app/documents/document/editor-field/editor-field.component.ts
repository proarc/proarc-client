import { Component, OnInit, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HelpDialogComponent } from 'src/app/dialogs/help-dialog/help-dialog.component';
import { ModsElement } from 'src/app/model/mods/element.model';

import { ElementField } from 'src/app/model/mods/elementField.model';
import { LayoutService } from 'src/app/services/layout.service';

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
  @Output() sizeChanged = new EventEmitter<string>();

  @ContentChild("templateContent") templateContent : TemplateRef<any>;
  @ContentChild("templateMenu") templateMenu : TemplateRef<any>;

  validationWarning: string;
  //items: ModsElement[];
  
  constructor(
    private dialog: MatDialog, 
    private translator: TranslateService, 
    private cd: ChangeDetectorRef,
    private layout: LayoutService) {
  }

  switchCollapsed(item: ModsElement) {
    item.switchCollapsed();
    this.setMetadataResized();
  }

  addAfterItem(item: ModsElement) {
    this.field.addAfterItem(item);
    this.setMetadataResized();
  }

  removeItem(item: ModsElement) {
    this.field.removeItem(item);
    this.setMetadataResized();
  }

  moveUp(item: ModsElement) {
    this.field.moveUp(item);
    this.setMetadataResized();
  }

  moveDown(item: ModsElement) {
    this.field.moveDown(item);
    this.setMetadataResized();
  }

  setMetadataResized() {
    setTimeout(() => {
      this.layout.setMetadataResized();
    }, 10);
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

  showByGenre(idx: number, item: any) {
    return  idx > 0
            || !this.showGenreSwitch
            || !item.attrs['type']
            ||  (item.attrs['type'] !== 'peer-reviewed' ) 
           ;
  }


}
