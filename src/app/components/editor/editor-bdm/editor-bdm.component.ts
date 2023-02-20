import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import {SimpleDialogData} from '../../../dialogs/simple-dialog/simple-dialog';
import {SimpleDialogComponent} from '../../../dialogs/simple-dialog/simple-dialog.component';
import { Metadata } from 'src/app/model/metadata.model';
import { LayoutService } from 'src/app/services/layout.service';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor-bdm',
  templateUrl: './editor-bdm.component.html',
  styleUrls: ['./editor-bdm.component.scss']
})
export class EditorBdmComponent implements OnInit {

  @Input() notSaved = false;
  @Input() model: string;
  // @Input() pid: string;
  @Input() metadata: Metadata;
  state = 'none';

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  // @Input()
  // set pid(pid: string) {
  //   this.onPidChanged(pid);
  // }
  constructor(public layout: LayoutService,
    private translator: TranslateService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnChanges(c: SimpleChanges) {

    if (c['metadata'] && c['metadata'].currentValue) {
      this.metadata = c['metadata'].currentValue;
      return;
    }

    if (!this.layout.lastSelectedItem || this.layout.lastSelectedItem.isPage()) {
      return;
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

        this.layout.refreshSelectedItem(false, null);
      }
    });
  }

  onSave() {
    if (this.metadata.validate()) {
      this.saveMetadata(false);
    } else {

      const data: SimpleDialogData = {
        title: "Nevalidní data",
        message: "Nevalidní data, přejete si dokument přesto uložit?",
        btn1: {
          label: "Uložit nevalidní dokument",
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
          this.saveMetadata(false);
        }
      });
    }
  }

  available(element: string): boolean {
    return this.metadata.template[element];
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        //this.repo.saveModsFromCatalog(result['mods'], () => { });
      }
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
      }
    });
  }

}
