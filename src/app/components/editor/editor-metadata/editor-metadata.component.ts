import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { UIService } from 'src/app/services/ui.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  state = 'none';

  @Input() notSaved = false;

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  constructor(
    private translator: TranslateService,
    public editor: EditorService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    if (this.notSaved) {
      // nic, uz mame metadata v editoru
      // this.editor.metadata = this.metadata;
    } else {
      this.state = 'loading';
      this.editor.loadMetadata(() => {
        this.state = 'success';
      });
    }
  }

  available(element: string): boolean {
    return this.editor.metadata.template[element];
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
          let data = `model=${this.editor.metadata.model}`;
          data = `${data}&pid=${this.editor.metadata.pid}`;
          data = `${data}&xml=${this.editor.metadata.toMods()}`;
          this.api.createObject(data).subscribe((response: any) => {
            if (response['response'].errors) {
              this.ui.showErrorSnackBarFromObject(response['response'].errors);
              this.state = 'error';
              return;
            }
            const pid = response['response']['data'][0]['pid'];
            this.state = 'success';
          });

        } else {
          this.editor.saveMetadata(ignoreValidation, (r: any) => {
            if (r && r.errors && r.status === -4 && !ignoreValidation) {
              const messages = this.ui.extractErrorsAsString(r.errors);
              if (r.data === 'cantIgnore') {
                this.ui.showErrorSnackBar( messages)
              } else {
                this.confirmSave(this.translator.instant('common.warning'), messages, true);
              }
              
            }
          });
        }
      }
    });
  }

  onSave() {
    if (this.editor.metadata.validate()) {
      if (this.notSaved) {
        let data = `model=${this.editor.metadata.model}`;
        data = `${data}&pid=${this.editor.metadata.pid}`;
        data = `${data}&xml=${this.editor.metadata.toMods()}`;
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

      } else {
        this.editor.saveMetadata(false, (r: any) => {
          if (r && r.errors && r.status === -4) {
            const messages = this.ui.extractErrorsAsString(r.errors);
            if (r.data === 'cantIgnore') {
              this.ui.showErrorSnackBar(messages);
              
            } else {
              this.confirmSave(this.translator.instant('common.warning'), messages, true);
            }
          }
        });
      }
    } else {
      this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', true);
    }
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.editor.saveModsFromCatalog(result['mods'], () => { });
        // this.editor.updateModsFromCatalog(result['mods']);
        // setTimeout(() => {
        //   if (!this.editor.metadata.validate()) {
        //     this.ui.showErrorSnackBar('Importovaná metadata z katalogu obsahuje nevalidní data');
        //   }
        // }, 100);
      }
    });
  }

}
