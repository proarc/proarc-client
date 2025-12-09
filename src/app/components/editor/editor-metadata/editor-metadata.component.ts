import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { UIService } from 'src/app/services/ui.service';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Subscription } from 'rxjs';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {


  @Input('editorType') editorType: string;
  @Output() onChangeEditorType = new EventEmitter<string>();

  state = 'none';

  @Input() notSaved = false;
  @Input() panel: ILayoutPanel;
  @Input() model: string;
  @Input() instance: string;


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
    private localS: LocalStorageService,
    public layout: LayoutService,
    private tmpl: TemplateService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  validate() {
    this.isValidMetadata = this.metadata.validate();
    console.log(this.isValidMetadata, this.model)
      setTimeout(() => {
        this.onSizeChanged();
      }, 10);
  }

  changeEditorType(t: string) {
    this.onChangeEditorType.emit(t);
  }

  ngOnInit() {
    this.byField = !this.notSaved && this.localS.getBoolProperty('metadata_by_field');
    this.subscriptions.push(this.layout.metadataResized().subscribe(e => {
      this.onSizeChanged();
    }));
  }

  toggleByField() {
    this.byField = !this.byField;
    this.localS.setBoolProperty('metadata_by_field', this.byField);
      this.scroller.nativeElement.scrollTop = 0;
    if (this.byField) {
      this.scrollHeight = 0;
      this.checkVisibility();
    } else {
      // this.selectedField = this.availableFields[0];
      this.availableFields.forEach(k => {
        this.visibleFields[k] = true;
      });
      this.setFieldsPositions();
    }
  }

  _validating = false;
  @Input()
  set validating(v: boolean) {
    if (v) {
      this.availableFields.forEach(k => {
        this.visibleFields[k] = true;
      });
      //this.scroller.nativeElement.scrollTop = 0;
      this.setFieldsPositions();
      this.onSizeChanged();
    }
    this._validating = v;
  }

  public metadata: Metadata;
  @Input()
  set data(m: Metadata) {
    if (m === null) {
      this.state = 'loading';
    } else {
      this.state = 'none';
    }

    if (!m || !m.template) {
      return;
    }


    // if (!m || !m.template || (m.timestamp && m.timestamp === this.metadata?.timestamp)) {
    //   setTimeout(() => {
    //     this.onSizeChanged();
    //   }, 10)

    //   return;
    // }

    this.metadata = m;
    this.state = 'none';
    this.setShowGenreSwitch();
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


    if (!this.layout.lastSelectedItem || this.layout.lastSelectedItem.isPage()) {
      this.visible = false;
    }
    this.layout.clearPanelEditing();
  }

  scrollHeight = 0;
  startHeight = 0;
  endHeight = 0;

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
      this.availableFieldsSorted.push(el.id.substring(this.panel.id.length))
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

  scrollToElement(field: string) {
    const idx = this.fieldsOrder.indexOf(this.panel.id + field);
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
      if (this.visibleFields[id.substring(this.panel.id.length)]) {
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

    if (this._validating) {
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
            this.selectedField = this.fieldsOrder[i].substring(this.panel.id.length);
            //console.log(this.selectedField, i,  this.fieldsOrder)
          }
          firstFound = true;
          visibleHeight += this.fieldsPositions[i].height;
        }
        if (!v && firstFound) {
          lastFound = true;
        }
        this.visibleFields[this.fieldsOrder[i].substring(this.panel.id.length)] = v;
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

  checkPendingChanges() {
    //console.log(this.metadata)
    const r = this.metadata.hasChanges();
    //console.log(r)
  }

  hasPendingChanges(): boolean {
    if (!this.metadata) {
      return false;
    }
    if (!this.panel.canEdit) {
      return false;
    }
    this.hasChanges = this.metadata.hasChanges();
    const focused = document.activeElement;
    const panel = document.getElementById(this.panel.id);
    const isChild = panel.contains(focused);
    if (isChild && this.hasChanges) {
      this.layout.setPanelEditing(this.panel);
    }
    return this.hasChanges;
  }

  available(element: string): boolean {
    return this.metadata && this.metadata.template && this.metadata.template[element];
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
        if (this.notSaved) {
          let data = `model=${this.metadata.model}`;
          data = `${data}&pid=${this.metadata.pid}`;
          data = `${data}&xml=${this.metadata.toMods()}`;
          this.api.createObject(data).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorDialogFromObject(response['response'].errors);
              this.state = 'error';
              return;
            }
            const pid = response['response']['data'][0]['pid'];
            this.state = 'success';
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
    const query = this.notSaved ?
      'app-new-metadata-dialog .app-expanded .mat-form-field-invalid input, app-new-metadata-dialog .app-editor-container .mat-form-field-invalid mat-select ' :
      'app-editor-metadata .app-expanded .mat-form-field-invalid input, app-editor-metadata .app-editor-container .mat-form-field-invalid mat-select ';
    const els = document.querySelectorAll(query);
    if (els.length > 0) {
      (els[0] as any).focus();
    }
    this.state = 'none';
    // els.forEach((el: any) => {
    //   if (el.clientHeight > 0) {
    //     el.focus();
    //     return
    //   }
    // });

  }

  focusToFirstRequired() {
    // find in new object
    const query = this.notSaved ? 'app-new-metadata-dialog  .app-expanded input[required]' : 'app-editor-metadata input[required]';
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

  revert() {
    this.layout.lastSelectedItemMetadata = null;
    this.metadata = null;
    this.layout.setSelectionChanged(false, null);
  }

  onSave() {
    this.isValidMetadata = this.metadata.validate();
    if (this.isValidMetadata) {
      if (this.notSaved) {
        let data = `model=${this.metadata.model}`;
        data = `${data}&pid=${this.metadata.pid}`;
        data = `${data}&xml=${this.metadata.toMods()}`;
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            this.state = 'error';
            return;
          }
          const pid = response['response']['data'][0]['pid'];
          this.state = 'success';
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
        // this._validating = true;
        this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', true);
      //}, 1000);
    }, 10);

    }
  }


  saveMetadata(ignoreValidation: boolean) {
    this.state = 'loading';
    if (this.instance != null) {
      this.api.saveKrameriusMods(this.metadata.pid, this.instance, this.metadata.toMods(), this.metadata.timestamp).subscribe((response: any) => {
        if (response && response['response'] && response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorDialogFromObject(response['response'].errors);
          this.state = 'error';
          return;
        } else {
          this.metadata.timestamp = response['response'].data[0].timestamp;
          this.metadata.resetChanges();
          this.ui.showInfoSnackBar(this.translator.instant("snackbar.changeSaved"));
          this.layout.refreshSelectedItem(false, 'metadata');
          this.layout.clearPanelEditing();
          this.checkVisibility();
          this.state = 'none';
        }
      });
    } else {
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
            this.state = 'error';
            return;
          }
        } else {
          // this.layout.setShouldRefresh(true)
          this.metadata.timestamp = response.data[0].timestamp;
          this.metadata.resetChanges();
          this.ui.showInfoSnackBar(this.translator.instant("snackbar.changeSaved"));
          this.layout.refreshSelectedItem(false, 'metadata');
          this.layout.clearPanelEditing();
          this.state = 'none';
        }
        // setTimeout(() => {
        //   this.focusToFirstInvalid();
        // }, 500);
      });
    }
  }

  saveModsFromCatalog(xml: string, catalogId: string) {
    this.state = 'saving';
    this.api.editModsXml(this.metadata.pid, xml, this.metadata.timestamp, null, false, null, catalogId).subscribe((resp: any) => {
      if (resp.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(resp.errors);
        setTimeout(() => {
          this.isValidMetadata = this.metadata.validate();
        }, 100);
        return;
      }
      this.state = 'success';
      this.layout.refreshSelectedItem(false, 'metadata');
    });
  }


  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.saveModsFromCatalog(result['mods'], result['catalogId']);
      }
    });
  }

  setStandard() {
    this.tmpl.getTemplate(this.metadata.standard, this.layout.lastSelectedItem.model).subscribe((tmpl: any) => {
      this.layout.lastSelectedItemMetadata = new Metadata(this.metadata.pid, this.metadata.model, this.metadata.originalMods, this.metadata.timestamp, this.metadata.standard, tmpl);
      this.metadata = this.layout.lastSelectedItemMetadata;
      this.setShowGenreSwitch();
    });
  }

  setShowGenreSwitch() {
    this.showGenreSwitch = this.metadata.model === 'model:ndkearticle' || this.metadata.model === 'model:bdmarticle';
  }

}
