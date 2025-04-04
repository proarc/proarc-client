import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HelpDialogComponent } from '../../dialogs/help-dialog/help-dialog.component';
import { ModsElement } from '../../model/mods/element.model';
import { ElementField } from '../../model/mods/elementField.model';
import { LayoutService } from '../../services/layout-service';
@Component({
  imports: [CommonModule, TranslateModule,
    MatIconModule, MatTooltipModule, MatButtonModule
  ],
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
  
  @Output() valueChange = new EventEmitter<string>();

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
    if (this.field.id === 'genre' && this.field.isPeerReviewed) {
      this.field.items[0].attrs.type ="peer-reviewed";
      // if (this.field.items.length === 1) {
      //   this.field.add();
      // }
    }
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
      // this.layout.setMetadataResized();
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
            || this.field.items.length === 1
    //         || (!item.attrs['type'] && this.field.items.length > 1 && (this.field.items[0].modsElement['_'] !== this.field.items[1].modsElement['_']))
    //         || (item.attrs['type'] && item.attrs['type'] !== 'peer-reviewed' ) 
    //        ;

  }


}
