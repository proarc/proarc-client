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

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {


  @Input('editorType') editorType: string;
  @Output() onChangeEditorType = new EventEmitter<string>();

  state = 'none';

  @Input() notSaved = false;
  // @Input() pid: string;
  @Input() model: string;


  @ViewChild("scroller", { static: false }) scroller: ElementRef;

  public item: DocumentItem | null;
  public visible = true;

  public fieldIds: { [key: string]: any } = {};
  public fields: { [key: string]: any } = {};
  public availableFields: string[];
  public visibleFields: { [key: string]: boolean } = {};
  public selectedField: string;
  public byField: boolean = true;
  showGenreSwitch: boolean;

  // public fieldsOrder: { [key: string]: string[] } = {
  //   chronicle: ['location', 'identifier', 'genre', 'titleInfo', 'abstract', 'language', 'originInfo', 'name', 'note'],

  //   bdm: ['genre', 'language', 'identifier', 'physicalDescription', 'part', 'titleInfo', 'name', 'abstract', 'subject', 'note',
  //     'classification', 'location', 'relatedItem', 'recordInfo'],

  //   earticle: ['genre', 'titleInfo', 'name', 'originInfo', 'location', 'identifier', 'language', 'physicalDescription', 'abstract', 'note',
  //     'typeOfResource', 'classification', 'subject', 'part', 'tableOfContents', 'recordInfo', 'relatedItem'],

  //   default: ['titleInfo', 'name', 'originInfo', 'location', 'identifier', 'language', 'physicalDescription', 'abstract', 'note',
  //     'typeOfResource', 'genre', 'classification', 'subject', 'part', 'tableOfContents', 'recordInfo', 'relatedItem']
  // };

  fieldsOrder: string[];

  constructor(
    private translator: TranslateService,
    private localS: LocalStorageService,
    public layout: LayoutService,
    private tmpl: TemplateService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }

  logMetadata() {
    console.log(this.metadata);
  }

  changeEditorType(t: string) {
    this.onChangeEditorType.emit(t);
  }

  ngOnInit() {
    this.byField = !this.notSaved && this.localS.getBoolProperty('metadata_by_field');
  }

  toggleByField() {
    this.byField = !this.byField;
    this.localS.setBoolProperty('metadata_by_field', this.byField);
    this.checkVisibility();
  }

  public metadata: Metadata;
  @Input()
  set data(m: Metadata) {
    if (!m || !m.template || (m.timestamp && m.timestamp === this.metadata?.timestamp)) {
      return;
    }

    this.metadata = m;
    this.setShowGenreSwitch();
    this.availableFields = Object.keys(this.metadata.template);
    Object.keys(this.metadata.template).forEach(k => {
      this.fieldIds[k] = true;
      this.fields[k] = this.metadata.getField(k);
      this.visibleFields[k] = true;
    });
    this.selectedField = this.availableFields[0];
    if (this.scroller) {
      this.scroller.nativeElement.scrollTop = 0;
    }
    setTimeout(() => {
      this.setFieldsOrder();
    }, 10);


    if (!this.layout.lastSelectedItem || this.layout.lastSelectedItem.isPage()) {
      this.visible = false;
    }
  }

  setFieldsOrder() {

    if (!this.scroller) {
      setTimeout(() => {
        this.setFieldsOrder();
      }, 10);
      return;
    }
    //check if already rendered
    if (this.scroller.nativeElement.children.length < this.availableFields.length) {
      
      setTimeout(() => {
        this.setFieldsOrder();
      }, 10);
      return;
    }


    this.scroller.nativeElement.scrollTop = 0;
    this.fieldsOrder = [];
    for (let i = 0; i < this.scroller.nativeElement.children.length; i++) {
      const el = this.scroller.nativeElement.children[i];
      this.fieldsOrder.push(el.id);
    }
    //console.log(this.fieldsOrder)

    setTimeout(() => {
      this.checkVisibility();
      if (this.layout.moveFocus) {
        setTimeout(() => {
          this.focusToFirstRequired();
        }, 10);
      }
    }, 10);

  }

  changeSelected(e: any) {
    this.selectedField = e;
    this.availableFields.forEach(k => {
      this.visibleFields[k] = false;
    });
    this.visibleFields[this.selectedField] = true;
  }

  elementIsVisibleInViewport(el: any): boolean {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    // const { innerHeight, innerWidth } = window;
    const viewPort = this.scroller.nativeElement.getBoundingClientRect();
    return ((top <= viewPort.top && bottom > viewPort.top) ||
      (top > viewPort.top && top < viewPort.bottom));
  }

  checkVisibility() {

    // this.availableFields.forEach(k => {
    //   this.visibleFields[k] = true;
    // });

    if (this.byField) {

      this.availableFields.forEach(k => {
        this.visibleFields[k] = false;
      });
      this.visibleFields[this.selectedField] = true;
      return;
    }

    if (this.scroller) {
      const els: string[] = [];
      for (let i = 0; i < this.scroller.nativeElement.children.length; i++) {
        // const el = this.scroller.nativeElement.children
        const el = this.scroller.nativeElement.children[i];

        const v = this.elementIsVisibleInViewport(el);
        this.visibleFields[el.id] = v;
        if (v) {
          els.push(el.id);
        }
      }

      for (let i = 0; i < this.fieldsOrder.length; i++) {
        const id = this.fieldsOrder[i];
        if (els.includes(id)) {
          this.visibleFields[this.fieldsOrder[i]] = true;
          if (i > 0) {
            this.visibleFields[this.fieldsOrder[i - 1]] = true;
          }
          if (i < this.fieldsOrder.length - 1) {
            this.visibleFields[this.fieldsOrder[i + 1]] = true;
          }
        } else {
          //this.visibleFields[this.fieldsOrder['default'][i]] = false;
        }
      }

      //console.log(this.visibleFields);

    }
  }

  checkPendingChanges() {
    console.log(this.metadata)
    const r = this.metadata.hasChanges();
    console.log(r)
  }

  hasPendingChanges(): boolean {
    if (!this.metadata) {
      return false;
    }
    return this.metadata.hasChanges();
  }

  available(element: string): boolean {
    return this.metadata && this.metadata.template && this.metadata.template[element];
  }

  confirmSave(title: string, message: string, ignoreValidation: boolean) {
    const data: SimpleDialogData = {
      title,
      message,
      alertClass: 'app-message',
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
      } else {
        this.focusToFirstInvalid();
      }
    });
  }

  focusToFirstInvalid() {
    const el: any = document.querySelectorAll('.mat-form-field-invalid input, .mat-form-field-invalid mat-select')[0];
    if (el) {
      el.focus();
    }
  }

  focusToFirstRequired() {
    // find in new object
    let el: any = document.querySelectorAll('app-new-metadata-dialog input[required]')[0];
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

  onSave() {
    if (this.metadata.validate()) {
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
        }, 500);
      } else {
        this.saveMetadata(false);
      }
    } else {
      this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', true);
    }
  }


  saveMetadata(ignoreValidation: boolean) {
    this.state = 'saving';
    this.api.editMetadata(this.metadata, ignoreValidation).subscribe((response: any) => {
      if (response.errors) {
        if (response.status === -4) {
          // Ukazeme dialog a posleme s ignoreValidation=true
          //this.state = 'error';
          const messages = this.ui.extractErrorsAsString(response.errors);
          if (response.data === 'cantIgnore') {
            this.ui.showErrorSnackBar(messages);
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
        // console.log(response)
        this.metadata.timestamp = response.data[0].timestamp;
        this.metadata.resetChanges();
        this.ui.showInfoSnackBar(this.translator.instant("snackbar.changeSaved"));
        this.layout.refreshSelectedItem(false, 'metadata');
      }
      setTimeout(() => {
        this.focusToFirstInvalid();
      }, 500);
    });
  }

  saveModsFromCatalog(xml: string) {
    this.state = 'saving';
    this.api.editModsXml(this.metadata.pid, xml, this.metadata.timestamp, null, false).subscribe((resp: any) => {
      if (resp.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(resp.errors);
        setTimeout(() => {
          this.metadata.validate();
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
        this.saveModsFromCatalog(result['mods']);
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
