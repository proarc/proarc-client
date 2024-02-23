import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';
import { UIService } from 'src/app/services/ui.service';
import { NewObjectDialogComponent } from '../new-object-dialog/new-object-dialog.component';
import { SimpleDialogData } from '../simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';
import { ILayoutPanel } from '../layout-admin/layout-admin.component';

@Component({
  selector: 'app-new-metadata-dialog',
  templateUrl: './new-metadata-dialog.component.html',
  styleUrls: ['./new-metadata-dialog.component.scss']
})
export class NewMetadataDialogComponent implements OnInit {

  public inited = true;
  state = 'none';
  metadata: Metadata;

  editorParams: any;
  validating = false;
  panel: ILayoutPanel = {
    id: 'new',
    visible: true,
    size: 0,
    type: 'a',
    isDirty: false,
    canEdit: true
  };

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<NewMetadataDialogComponent>,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    private tmpl: TemplateService,
    private layout: LayoutService,
    private translator: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    const standard = Metadata.resolveStandardFromXml(this.data.content);
    this.tmpl.getTemplate(standard, this.data.model).subscribe((tmpl: any) => {
      this.metadata = new Metadata(this.data.pid, this.data.model, this.data.content, this.data.timestamp, standard, tmpl);
      setTimeout(() => {
        this.metadata.expandRequired();
      }, 100);
    });

    // this.metadata = new Metadata(this.data.pid, this.data.model, this.data.content, this.data.timestamp, null);

    // setTimeout(() => {
    //   this.metadata.expandRequired();
    // }, 100);

  }



  public isPage(): boolean {
    return this.data.model === 'model:page' || this.data.model === 'model:ndkpage' || this.data.model === 'model:oldprintpage';
  }

  public isAudioPage(): boolean {
    return this.data.model == 'model:ndkaudiopage';
  }

  // public isVolume(): boolean {
  //   return this.model === 'model:ndkperiodicalvolume';
  // }

  // public isIssue(): boolean {
  //   return this.model === 'model:ndkperiodicalissue';
  // }

  public isChronicle(): boolean {
    return this.data.model === 'model:chroniclevolume' || this.data.model === 'model:chronicletitle' || this.data.model === 'model:chroniclesupplement';
  }

  public isBdm(): boolean {
    return this.data.model === 'model:bdmarticle';
  }

  savePage() {
    let data = `model=${this.data.model}`;
    data = `${data}&pid=${this.data.pid}`;
    data = `${data}&xml=${encodeURIComponent(this.metadata.toMods())}`;
    // data = `${data}&xml=${encodeURIComponent(this.editor.page.toXml())}`;
    if (this.data.parent) {
      data = `${data}&parent=${this.data.parent}`;
    }
    this.api.createObject(data).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      this.layout.selectedParentItem.notSaved = false;
      this.state = 'success';
      this.metadata.resetChanges();
      this.dialogRef.close(response['response']['data'][0]);
    });
  }

  onClose() {
    const data: SimpleDialogData = {
      title: this.translator.instant('dialog.newMetadata.onClose.title'),
      message: this.translator.instant('dialog.newMetadata.onClose.alert'),
      alertClass: 'app-warn',
      btn1: {
        label: this.translator.instant('button.yes'),
        value: 'true',
        color: 'warn'
      },
      btn2: {
        label: this.translator.instant('button.no'),
        value: 'false',
        color: 'default'
      },
    };
    const d = this.dialog.open(SimpleDialogComponent, { data: data });
    d.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.state = 'success';
        // this.editor.init(this.editorParams);
        this.dialogRef.close('close');
      }
    });

  }

  onSave(gotoEdit: boolean) {
    if (this.isPage()) {
      this.savePage();
      return;
    }
    if (this.metadata.validate()) {
      let data = `model=${this.metadata.model}`;
      data = `${data}&pid=${this.metadata.pid}`;
      data = `${data}&xml=${encodeURIComponent(this.metadata.toMods())}`;
      if (this.data.parent) {
        data = `${data}&parent=${this.data.parent}`;
      }
      this.api.createObject(data).subscribe((response: any) => {
        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorDialogFromObject(response['response'].errors);
          this.state = 'error';
          return;
        }
        const pid = response['response']['data'][0]['pid'];
        this.state = 'success';
        this.state = 'success';
        this.metadata.resetChanges();
        this.dialogRef.close({ gotoEdit, item: response['response']['data'][0] });
        // if (gotoEdit) {
        // } else {
        //   this.dialogRef.close(response['response']['data'][0]);
        // }

      });
    } else {
      this.validating = true;
      this.confirmSave(this.translator.instant('dialog.newMetadata.onSave.title'), this.translator.instant('dialog.newMetadata.onSave.alert'), true, gotoEdit);
    }
  }

  confirmSave(title: string, message: string, ignoreValidation: boolean, gotoEdit: boolean) {
    const data: SimpleDialogData = {
      title,
      message,
      alertClass: 'app-warn',
      btn1: {
        label: this.translator.instant('button.save'),
        value: 'yes',
        color: 'warn'
      },
      btn2: {
        label: this.translator.instant('button.doNotSave'),
        value: 'no',
        color: 'default'
      },
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        let data = `model=${this.metadata.model}`;
        data = `${data}&pid=${this.metadata.pid}`;
        data = `${data}&xml=${encodeURIComponent(this.metadata.toMods())}`;
        if (this.data.parent) {
          data = `${data}&parent=${this.data.parent}`;
        }
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorDialogFromObject(response['response'].errors);
            this.state = 'error';
            return;
          }
          const pid = response['response']['data'][0]['pid'];
          this.state = 'success';
          this.metadata.resetChanges();
          this.dialogRef.close({ gotoEdit, item: response['response']['data'][0] });

        });
        this.validating = false;
      } else {
        // let el: any = document.querySelectorAll('app-new-metadata-dialog .mat-form-field-invalid input,app-new-metadata-dialog .mat-form-field-invalid mat-select')[0];
        // if (el) {
        //   el.focus();
        // }
        this.focusToFirstInvalid();
      }
    });
  }

  focusToFirstInvalid() {
    const els = document.querySelectorAll('app-new-metadata-dialog .mat-form-field-invalid input, app-new-metadata-dialog .mat-form-field-invalid mat-select ');
    for (let i = 0; i<els.length; i++){
      const el: any = els[i];
      if (el.clientHeight > 0) {
        el.focus();
        return;
      }
    };

  }

}
