import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {


  @Input('editorType') editorType: string;
  @Output() onChangeEditorType = new EventEmitter<string>();

  state = 'none';

  @Input() notSaved = false;
  // @Input() pid: string;
  @Input() model: string;
  @Input() metadata: Metadata;

  public item: DocumentItem | null;
  public visible = true;

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;


  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private tmpl: TemplateService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }


  changeEditorType(t: string) {
    this.onChangeEditorType.emit(t);
  }
  
  ngOnInit() {}

  ngOnChanges(c: SimpleChanges) {

    if (c['metadata'] && c['metadata'].currentValue &&  (c['metadata'].currentValue !== c['metadata'].previousValue) ) {
      this.metadata = c['metadata'].currentValue;
      
      setTimeout(() => {
        this.focusToFirstRequired();
      }, 500);
      return;
    }

    if (!this.layout.lastSelectedItem || this.layout.lastSelectedItem.isPage()) {
      this.visible = false;
      return;
    }
  }

  hasPendingChanges(): boolean {
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
    });
  }

  showGenreSwitch() {
    return this.metadata.model === 'model:ndkearticle' || this.metadata.model === 'model:bdmarticle';
  }

}
