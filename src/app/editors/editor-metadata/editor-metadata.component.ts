import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ElementRef, ViewChild, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { DocumentItem } from '../../model/documentItem.model';
import { Metadata } from '../../model/metadata.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { TemplateService } from '../../services/template.service';
import { UIService } from '../../services/ui.service';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';
import { MatRadioModule } from '@angular/material/radio';
import { EditorTitleComponent } from "../editor-title/editor-title.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditorGenreComponent } from "../editor-genre/editor-genre.component";
import { EditorAuthorComponent } from "../editor-author/editor-author.component";
import { EditorPublisherComponent } from "../editor-publisher/editor-publisher.component";
import { EditorLocationComponent } from "../editor-location/editor-location.component";
import { EditorIdentifierComponent } from "../editor-identifier/editor-identifier.component";
import { EditorLanguageComponent } from "../editor-language/editor-language.component";
import { Utils } from '../../utils/utils';
import { EditorPhysicalComponent } from "../editor-physical/editor-physical.component";
import { EditorAbstractComponent } from "../editor-abstract/editor-abstract.component";
import { EditorNoteComponent } from "../editor-note/editor-note.component";
import { EditorResourceComponent } from "../editor-resource/editor-resource.component";
import { EditorClassificationComponent } from "../editor-classification/editor-classification.component";
import { EditorSubjectComponent } from "../editor-subject/editor-subject.component";
import { EditorPartComponent } from "../editor-part/editor-part.component";
import { EditorTableOfContentsComponent } from "../editor-tableOfContents/editor-tableOfContents";
import { EditorAccessConditionComponent } from "../editor-accessCondition/editor-accessCondition.component";
import { EditorRecordInfoComponent } from "../editor-recordInfo/editor-recordInfo";
import { EditorRelatedItemComponent } from "../editor-relatedItem/editor-relatedItem.component";
import { EditorChronicleLocationComponent } from "../editor-chronicle-location/editor-chronicle-location.component";
import { MatButtonModule } from '@angular/material/button';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { CatalogDialogComponent } from '../../dialogs/catalog-dialog/catalog-dialog.component';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatRadioModule, MatFormFieldModule, MatSelectModule,
    EditorSwitcherComponent, EditorTitleComponent, EditorGenreComponent, 
    EditorAuthorComponent, EditorPublisherComponent, EditorLocationComponent, EditorIdentifierComponent, 
    EditorLanguageComponent, EditorPhysicalComponent, EditorAbstractComponent, EditorNoteComponent, 
    EditorResourceComponent, EditorClassificationComponent, EditorSubjectComponent, EditorPartComponent, 
    EditorTableOfContentsComponent, EditorAccessConditionComponent, EditorRecordInfoComponent, 
    EditorRelatedItemComponent, EditorChronicleLocationComponent]
  ,
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  panel = input<ILayoutPanel>();
  panelType = input<string>();
  pid = input<string>();
  model = input<string>();
  data = input<Metadata>();
  onChangePanelType = output<string>();

  notSaved = input<boolean>();
  _validating = false;
  validating = input<boolean>();
  loading: boolean;
  metadata: Metadata;

  @ViewChild("scroller", { static: false }) scroller: ElementRef;

  public item: DocumentItem | null;
  public visible = true;

  public fieldIds: { [key: string]: any } = {};
  public fields: { [key: string]: any } = {};
  public availableFields: string[];
  public availableFieldsSorted: string[] = [];
  public visibleFields: { [key: string]: boolean } = {};
  public selectedField: string;
  public byField: boolean = false;
  showGenreSwitch: boolean;

  fieldsOrder: string[];
  fieldsPositions: { id: string, top: number, bottom: number, height: number }[];
  subscriptions: Subscription[] = [];

  isValidMetadata = true;
  hasChanges = false;

  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private tmpl: TemplateService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) {
      effect(() => {
        const pid = this.pid();
        if (this.notSaved()) {
          this.metadata = this.data();
          if (this.metadata) {
            this.setFields();
          }
          
        } else {
          this.loadMetadata(pid);
        }
        this.hasChanges = false;
      });
      effect(() => {
        const m = Utils.metadataChanged();
        this.hasChanges = m > 0;
        if (m > 0) {
          this.hasPendingChanges();
        }
        
      });
      effect(() => {
        this.metadata = this.data();
        //  console.log(this.metadata)
        if (this.metadata) {
          this.setFields();
        }
      });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

  loadMetadata(pid: string) {
    if (!pid) {
      return;
    }
    this.loading = true;
    this.api.getMetadata(pid).subscribe(respMeta => {
      const standard = respMeta['record']['standard'] ? respMeta['record']['standard'] : Metadata.resolveStandardFromXml(respMeta['record']['content']);
      this.tmpl.getTemplate(standard, this.model()).subscribe((tmpl: any) => {
        this.layout.lastSelectedItemMetadata = new Metadata(pid, this.model(), respMeta['record']['content'], respMeta['record']['timestamp'], standard, tmpl);
        this.metadata = this.layout.lastSelectedItemMetadata;
        this.setFields();
        this.loading = false;
      })
    });
  }

  setFields() {
    this.availableFields = Object.keys(this.metadata.template);
    this.visibleFields = {};
    Object.keys(this.metadata.template).forEach(k => {
      this.fieldIds[k] = true;
      this.fields[k] = this.metadata.getField(k);
      this.visibleFields[k] = true;
    });
    this.selectedField = this.availableFields[0];
    if (this.scroller) {
      this.scroller.nativeElement.scrollTop = 0;
    }
    this.fieldsOrder = [];
    this.availableFieldsSorted = [];
    this.fieldsPositions = [];
    setTimeout(() => {
      this.isValidMetadata = this.metadata.validate();
      setTimeout(() => {
        this.setFieldsPositions();
      }, 10);
    }, 10);
  }

  setFieldsPositions() {

    if (!this.scroller) {
      setTimeout(() => {
        this.setFieldsPositions();
      }, 10);
      return;
    }
    //check if already rendered
    if (this.scroller.nativeElement.children.length < this.availableFields.length) {
      setTimeout(() => {
        this.setFieldsPositions();
      }, 10);
      return;
    }

    // this.scrollHeight = this.scroller.nativeElement.scrollHeight;
    let scrollHeight = 0;
    this.scroller.nativeElement.scrollTop = 0;
    this.fieldsOrder = [];
    this.fieldsPositions = [];
    const scrollerTop = this.scroller.nativeElement.getBoundingClientRect().top;
    for (let i = 2; i < this.scroller.nativeElement.children.length; i++) {
      const el = this.scroller.nativeElement.children[i];
      this.fieldsOrder.push(el.id);
      this.availableFieldsSorted.push(el.id.substring(this.panel().id.length))
      const { top, bottom, height } = el.getBoundingClientRect();
      const t = top - scrollerTop;
      // console.log(el.id, top, t)
      scrollHeight += height;
      this.fieldsPositions.push({ id: el.id, top: t, bottom, height });
    }

    for (let i = 0; i < this.fieldsOrder.length; i++) {
      const el = document.getElementById(this.fieldsOrder[i]);
      el.style['position'] = 'absolute';
      el.style['width'] = '100%';
      el.style['top'] = this.fieldsPositions[i].top + 'px';
    }
    this.scrollHeight = scrollHeight;

    setTimeout(() => {

      this.setElStyles();
      if (this.layout.moveFocus) {
        setTimeout(() => {
          this.focusToFirstRequired();
        }, 30);
      }
    }, 20);
  }

  focusToFirstRequired() {
    // find in new object
    const query = this.notSaved() ? 'app-new-metadata-dialog  .app-expanded input[required]' : 'app-editor-metadata input[required]';
    let el: any = document.querySelectorAll(query)[0];
    if (el) {
      el.focus();
      return;
    }

    //find in already exiting object
    el = document.querySelectorAll('input[required]')[0];
    if (el) {
      el.focus();
    }

  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.saveModsFromCatalog(result['mods'], result['catalogId']);
      }
    });
  }

  saveModsFromCatalog(xml: string, catalogId: string) {
    this.loading = true;
    this.api.editModsXml(this.metadata.pid, xml, this.metadata.timestamp, null, false, null, catalogId).subscribe((resp: any) => {
      if (resp.errors) {
        this.loading = false;
        this.ui.showErrorDialogFromObject(resp.errors);
        setTimeout(() => {
          this.isValidMetadata = this.metadata.validate();
        }, 100);
        return;
      }
      this.loading = false;
      this.layout.refreshSelectedItem(false, 'metadata');
    });
  }

  validate() {
    this.isValidMetadata = this.metadata.validate();
    console.log(this.isValidMetadata, this.model)
      setTimeout(() => {
        // this.onSizeChanged();
      }, 10);
  }

  onSaveTest() {
    console.log(this.metadata);
    console.log(this.metadata.toMods())
  }

  onSave() {
    this.isValidMetadata = this.metadata.validate();
    if (this.isValidMetadata) {
      if (this.notSaved()) {
        let data = `model=${this.metadata.model}`;
        data = `${data}&pid=${this.metadata.pid}`;
        data = `${data}&xml=${this.metadata.toMods()}`;
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            this.loading = false;
            return;
          }
          const pid = response['response']['data'][0]['pid'];
          this.loading = false;
        });

        setTimeout(() => {
          this.focusToFirstInvalid();
        }, 10);
      } else {
        this.saveMetadata(false);
      }
    } else {
      //setTimeout(() => {
      //  this.validating =true;
      setTimeout(() => {
        this.onSizeChanged();
        // this.setFieldsPositions();
        this._validating = true;
        this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', true);
      //}, 1000);
    }, 10);
      
    }
  }
  saveMetadata(ignoreValidation: boolean) {
    this.loading = true;
    this.api.editMetadata(this.metadata, ignoreValidation, null).subscribe((response: any) => {
      if (response.errors) {
        if (response.status === -4) {
          // Ukazeme dialog a posleme s ignoreValidation=true
          //this.state = 'error';
          const messages = this.ui.extractErrorsAsString(response.errors);
          if (response.data === 'cantIgnore') {
            // #462 - replaced with row bellow - this.ui.showErrorSnackBar(messages);
            this.ui.showErrorDialogFromObject(response.errors);
          } else {
            this.confirmSave(this.translator.instant('common.warning'), messages, true);
          }
          return;
        } else {
          this.ui.showErrorDialogFromObject(response.errors);
          this.loading = false;
          return;
        }
      } else {
        // this.layout.setShouldRefresh(true)
        this.metadata.timestamp = response.data[0].timestamp;
        this.metadata.resetChanges();
        this.ui.showInfoSnackBar(this.translator.instant("snackbar.changeSaved"));
        this.layout.refreshSelectedItem(false, 'metadata');
        this.layout.clearPanelEditing();
        this.loading = false;
      }
      // setTimeout(() => {
      //   this.focusToFirstInvalid();
      // }, 500);
    });
  }

  confirmSave(title: string, message: string, ignoreValidation: boolean) {
    const data: SimpleDialogData = {
      title,
      message,
      alertClass: 'app-info',
      btn1: {
        label: "Uložit",
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: "Neukládat",
        value: 'no',
        color: 'default'
      },
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    // this.availableFields.forEach(k => {
    //   this.visibleFields[k] = true;
    // });
    // this.scroller.nativeElement.scrollTop = 0;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (this.notSaved()) {
          let data = `model=${this.metadata.model}`;
          data = `${data}&pid=${this.metadata.pid}`;
          data = `${data}&xml=${this.metadata.toMods()}`;
          this.api.createObject(data).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorDialogFromObject(response['response'].errors);
              this.loading = false;
              return;
            }
            const pid = response['response']['data'][0]['pid'];
            this.loading = false;
            // this.layout.setShouldRefresh(true);
            this.layout.refreshSelectedItem(false, null);
          });

        } else {
          this.saveMetadata(ignoreValidation);
        }
        this._validating = false;
      } else {
        
        this.focusToFirstInvalid();
      }
    });
  }

  focusToFirstInvalid() {
    const query = this.notSaved() ?
      'app-new-metadata-dialog .app-expanded .mat-form-field-invalid input, app-new-metadata-dialog .app-editor-container .mat-form-field-invalid mat-select ' :
      'app-editor-metadata .app-expanded .mat-form-field-invalid input, app-editor-metadata .app-editor-container .mat-form-field-invalid mat-select ';
    const els = document.querySelectorAll(query);
    if (els.length > 0) {
      (els[0] as any).focus();
    }
    this.loading = false;

  }

  revert() {
    this.layout.clearPanelEditing();
    this.metadata = null;
    this.loadMetadata(this.pid());
    Utils.metadataChanged.set(0);
    this.hasChanges = false;
  }

  hasPendingChanges(): boolean {
    if (!this.metadata) {
      return false;
    }
    if (!this.panel().canEdit) {
      return false;
    }
    this.hasChanges = this.metadata.hasChanges();
    const focused = document.activeElement;
    const panel = document.getElementById(this.panel().id);
    if (!panel) {
      return false;
    }
    const isChild = panel.contains(focused);
    if (isChild && this.hasChanges && this.layout.editingPanel !== this.panel().id) {
      this.layout.setPanelEditing(this.panel());
    }
    return this.hasChanges;
  }

  scrollHeight = 0;
  startHeight = 0;
  endHeight = 0;
  scrollToElement(field: string) {
    const idx = this.fieldsOrder.indexOf(this.panel().id + field);
    if (this.byField) {
      this.scroller.nativeElement.scrollTop = 0;
      this.changeSelected(field);
    } else {
      this.scroller.nativeElement.scrollTop = this.fieldsPositions[idx].top; // - this.scroller.nativeElement.getBoundingClientRect().top;
    }
  }

  changeSelected(e: any) {
    this.selectedField = e;
    this.availableFields.forEach(k => {
      this.visibleFields[k] = true;
    });
    this.visibleFields[this.selectedField] = true;
    setTimeout(() => {this.setElStyles()}, 10)
    // this.checkVisibility();
  }

  onSizeChanged() {
    if(this.fieldsOrder.length === 0) {
      return;
    }
    // find element resized
    let idx = 0;
    let id = '';
    let oldH = 0;
    let el = null;
    let newH = 0;
    for (let i = 0; i < this.fieldsOrder.length; i++) {
      id = this.fieldsOrder[i];
      if (this.visibleFields[id.substring(this.panel().id.length)]) {
        idx = i;
        oldH = this.fieldsPositions[idx].height;
        el = document.getElementById(id);
        newH = el.getBoundingClientRect().height;

        if (oldH !== newH) {
          break;
        }
      }
    }

    const delta = newH - oldH;
    this.scrollHeight = this.scrollHeight + delta;
    this.fieldsPositions[idx].height = newH;
    this.fieldsPositions[idx].bottom = this.fieldsPositions[idx].bottom + delta;
    for (let i = idx + 1; i < this.fieldsPositions.length; i++) {
      this.fieldsPositions[i].top = this.fieldsPositions[i].top + delta;
      this.fieldsPositions[i].bottom = this.fieldsPositions[i].bottom + delta;
    }


    this.checkVisibility();
  }

  elementIsVisibleInViewport(el: any): boolean {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const viewPort = this.scroller.nativeElement.getBoundingClientRect();
    return ((top <= viewPort.top && bottom > viewPort.top) ||
      (top > viewPort.top && top < viewPort.bottom));
  }

  elementIsVisibleInViewport2(idx: number, top: number, bottom: number): boolean {
    const el = this.fieldsPositions[idx];
    return ((el.top <= top && el.bottom > top+3) ||
      (el.top > top && el.top < bottom));
  }

  checkVisibility() {

    if (this.validating() || true) {
      return;
    }

    if (this.byField) {

      this.availableFields.forEach(k => {
        this.visibleFields[k] = true;
      });
      this.visibleFields[this.selectedField] = true;
      setTimeout(() => {this.setElStyles()}, 10)
      return;
    }

    if (this.scroller) {
      const els: string[] = [];

      const top = this.scroller.nativeElement.getBoundingClientRect().top + this.scroller.nativeElement.scrollTop;
      const bottom = this.scroller.nativeElement.getBoundingClientRect().bottom + this.scroller.nativeElement.scrollTop;
      // const top = this.scroller.nativeElement.scrollTop;
      // const bottom = this.scroller.nativeElement.getBoundingClientRect().height + this.scroller.nativeElement.scrollTop;
      this.startHeight = 0;
      this.endHeight = 0;
      let visibleHeight = 0;
      let firstFound = false;
      let lastFound = false;
      for (let i = 0; i < this.fieldsOrder.length; i++) {
        const v = this.elementIsVisibleInViewport2(i, top, bottom);

        if (!v && !firstFound) {
          this.startHeight += this.fieldsPositions[i].height;
        }
        if (v) {
          if (!firstFound) {
            this.selectedField = this.fieldsOrder[i].substring(this.panel().id.length);
            //console.log(this.selectedField, i,  this.fieldsOrder)
          }
          firstFound = true;
          visibleHeight += this.fieldsPositions[i].height;
        }
        if (!v && firstFound) {
          lastFound = true;
        }
        this.visibleFields[this.fieldsOrder[i].substring(this.panel().id.length)] = v;
      }
      this.endHeight = this.scrollHeight - visibleHeight - this.startHeight;

    }
    setTimeout(() => {this.setElStyles()}, 1)
  }

  setElStyles() {
    //if (this.byField) {
      for (let i = 0; i < this.fieldsOrder.length; i++) {
        const id = this.fieldsOrder[i];
        const el = document.getElementById(id);
        if (el) {
          el.style['visibility'] = 'visible';
          el.style['position'] = 'relative';
          el.style['width'] = '100%';
          el.style['top'] = '0px';
        }
      }
    // } else {
    //   for (let i = 0; i < this.fieldsOrder.length; i++) {
    //     const id = this.fieldsOrder[i];
    //     const el = document.getElementById(id);
    //     if (el) {
    //       el.style['visibility'] = 'visible';
    //       el.style['position'] = 'absolute';
    //       el.style['width'] = '100%';
    //       el.style['top'] = this.fieldsPositions[i].top + 'px';
    //     }
    //   }
    // }
  }

  setStandard() {
    this.tmpl.getTemplate(this.metadata.standard, this.model()).subscribe((tmpl: any) => {
      this.layout.lastSelectedItemMetadata = new Metadata(this.metadata.pid, this.metadata.model, this.metadata.originalMods, this.metadata.timestamp, this.metadata.standard, tmpl);
      this.metadata = this.layout.lastSelectedItemMetadata;
      // this.setShowGenreSwitch();
    });
  }

}
