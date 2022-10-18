import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input, ViewChild, Output, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { UIService } from 'src/app/services/ui.service';
import { ApiService } from 'src/app/services/api.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  state = 'none';

  @Input() notSaved = false;
  @Input() item: DocumentItem;
  @Input() pid: string;
  

  constructor(
    private translator: TranslateService,
    public repo: RepositoryService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnChanges(c: SimpleChange) {
    if (this.pid && this.item) {
      this.load(this.pid);
    }
  }

  private onPidChanged(pid: string) {
    if (!pid) {
      return;
    }
    if (this.notSaved) {
      // nic, uz mame metadata v editoru
      // this.repo.metadata[this.pid] = this.metadata;
    } else {
      this.load(pid);
    }
  }

  load(pid: string) {
      this.state = 'loading';
      this.repo.loadMetadata(this.pid, this.item.model);
  }

  available(element: string): boolean {
    return this.repo.metadata[this.pid].template[element];
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
          let data = `model=${this.repo.metadata[this.pid].model}`;
          data = `${data}&pid=${this.repo.metadata[this.pid].pid}`;
          data = `${data}&xml=${this.repo.metadata[this.pid].toMods()}`;
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
          this.repo.saveMetadata(this.pid, this.item.model, ignoreValidation, (r: any) => {
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
    if (this.repo.metadata[this.pid].validate()) {
      if (this.notSaved) {
        let data = `model=${this.repo.metadata[this.pid].model}`;
        data = `${data}&pid=${this.repo.metadata[this.pid].pid}`;
        data = `${data}&xml=${this.repo.metadata[this.pid].toMods()}`;
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
        this.repo.saveMetadata(this.pid, this.item.model, false, (r: any) => {
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
        //this.repo.saveModsFromCatalog(result['mods'], () => { });
      }
    });
  }

}
