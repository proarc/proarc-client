import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  state = 'none';

  @Input() notSaved = false;
  @Input() pid: string;
  @Input() model: string;
  @Input() metadata: Metadata;

  public item: DocumentItem | null;
  public visible = true;

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;


  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges(c: SimpleChanges) {
    if (c['metadata'] && c['metadata'].currentValue) {
      this.metadata = c['metadata'].currentValue;
      return;
    }
    if (!this.layout.lastSelectedItem || this.layout.lastSelectedItem.isPage()) {
      this.visible = false;
      return;
    }

    if (this.pid) {
      this.item = this.layout.lastSelectedItem;
      this.pid = this.item.pid;
      this.visible = true;
      this.load();
    }
  }

  load() {
    this.state = 'loading';

    this.api.getMetadata(this.pid, this.model).subscribe((response: any) => {
      if (response.errors) {
        console.log('error', response.errors);
        this.ui.showErrorSnackBarFromObject(response.errors);
        this.state = 'error';
        return;
      }
      this.metadata = new Metadata(this.pid, this.model, response['record']['content'], response['record']['timestamp']);
      this.state = 'success';
    });


    // this.api.getMetadata(this.pid, this.item.model).subscribe((metadata: Metadata) => {
    //   this.metadata = metadata;
    //   this.state = 'success';
    // });
  }

  available(element: string): boolean {
    return this.metadata.template[element];
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
          });

        } else {
          this.saveMetadata(ignoreValidation);
        }
      }
    });
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
      }
    });
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
