import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import {SimpleDialogData} from '../../../dialogs/simple-dialog/simple-dialog';
import {SimpleDialogComponent} from '../../../dialogs/simple-dialog/simple-dialog.component';
import { LayoutService } from 'src/app/services/layout.service';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { MetadataService } from 'src/app/services/metadata.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor-chronicle',
  templateUrl: './editor-chronicle.component.html',
  styleUrls: ['./editor-chronicle.component.scss']
})
export class EditorChronicleComponent implements OnInit {

  @Input() model: string;
  @Input() notSaved = false;
  @Input() metadata: Metadata;
  state = 'none';

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  constructor(
    private translator: TranslateService,
    public layout: LayoutService, 
    private api: ApiService,
    private ui: UIService,
    //public metaService: MetadataService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    if (this.notSaved) {
      return;
    }
    if (!pid) {
      return;
    }
    // this.state = 'loading';
    // this.loadMetadata(this.pid, this.model, (metadata: Metadata) => {
    //   this.state = 'success';
    // });
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
            this.ui.showErrorSnackBarFromObject(response['response'].errors);
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
          this.ui.showErrorSnackBarFromObject(response.errors);
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

  confirmSave(title: string, message: string, ignoreValidation: boolean) {
    const data: SimpleDialogData = {
      title,
      message,
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
              this.ui.showErrorSnackBarFromObject(response['response'].errors);
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

  available(element: string): boolean {
    return this.metadata.template[element];
  }


  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
      }
    });
  }

}
