import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ElementRef, ViewChild, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
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

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatRadioModule, MatFormFieldModule, MatSelectModule,
    EditorSwitcherComponent, EditorTitleComponent, EditorGenreComponent, EditorAuthorComponent, EditorPublisherComponent, EditorLocationComponent, EditorIdentifierComponent, EditorLanguageComponent, EditorPhysicalComponent, EditorAbstractComponent, EditorNoteComponent, EditorResourceComponent, EditorClassificationComponent]
  ,
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();

  notSaved: boolean;
  loading: boolean;
  pid: string;
  model: string;
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
  public byField: boolean = true;
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
        this.pid = this.layout.lastSelectedItem().pid;
        this.model = this.layout.lastSelectedItem().model;
        this.loadMetadata();
        this.hasChanges = false;
      });
      effect(() => {
        const m = Utils.metadataChanged();
        this.hasChanges = m > 0;
        if (m > 0) {
          this.hasPendingChanges();
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

  loadMetadata() {
    this.loading = true;
    this.api.getMetadata(this.pid).subscribe(respMeta => {
      const standard = respMeta['record']['standard'] ? respMeta['record']['standard'] : Metadata.resolveStandardFromXml(respMeta['record']['content']);
      this.tmpl.getTemplate(standard, this.model).subscribe((tmpl: any) => {
        this.metadata = new Metadata(this.pid, this.model, respMeta['record']['content'], respMeta['record']['timestamp'], standard, tmpl);
        console.log(this.metadata);

        this.visibleFields = {};
        Object.keys(this.metadata.template).forEach(k => {
          this.fieldIds[k] = true;
          this.fields[k] = this.metadata.getField(k);
          this.visibleFields[k] = true;
        });

        this.loading = false;
      })
    });
  }

  onLoadFromCatalog() {
    // const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result['mods']) {
    //     this.saveModsFromCatalog(result['mods'], result['catalogId']);
    //   }
    // });
  }

  validate() {
    this.isValidMetadata = this.metadata.validate();
    console.log(this.isValidMetadata, this.model)
      setTimeout(() => {
        // this.onSizeChanged();
      }, 10);
  }

  onSave() {
    console.log(this.metadata);
    console.log(this.metadata.toMods())
  }

  revert() {
    this.layout.clearPanelEditing();
    this.metadata = null;
    this.loadMetadata();
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
    const isChild = panel.contains(focused);
    if (isChild && this.hasChanges && this.layout.editingPanel !== this.panel().id) {
      this.layout.setPanelEditing(this.panel());
    }
    return this.hasChanges;
  }

  scrollHeight = 0;
  startHeight = 0;
  endHeight = 0;
  _validating = false;
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
      this.visibleFields[k] = false;
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

    if (this._validating || true) {
      return;
    }

    if (this.byField) {

      this.availableFields.forEach(k => {
        this.visibleFields[k] = false;
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
    if (this.byField) {
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
    } else {
      for (let i = 0; i < this.fieldsOrder.length; i++) {
        const id = this.fieldsOrder[i];
        const el = document.getElementById(id);
        if (el) {
          el.style['visibility'] = 'visible';
          el.style['position'] = 'absolute';
          el.style['width'] = '100%';
          el.style['top'] = this.fieldsPositions[i].top + 'px';
        }
      }
    }
  }

  setStandard() {
    this.tmpl.getTemplate(this.metadata.standard, this.model).subscribe((tmpl: any) => {
      this.metadata = new Metadata(this.metadata.pid, this.metadata.model, this.metadata.originalMods, this.metadata.timestamp, this.metadata.standard, tmpl);
      // this.setShowGenreSwitch();
    });
  }

}
