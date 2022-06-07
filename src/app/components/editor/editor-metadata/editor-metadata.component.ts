import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  state = 'none';

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  constructor(
    private translator: Translator,
    public editor: EditorService, 
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.editor.loadMetadata(() => {
      this.state = 'success';
    });
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
        this.editor.saveMetadata(ignoreValidation, (r: any) => {
          if (r && r.errors && r.status === -4 && !ignoreValidation) {
            this.confirmSave(String(this.translator.instant('common.warning')), r.errors.mods[0].errorMessage, true);
          }
          // this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', false);
        });
      }
    });
  }

  onSave() {
    if (this.editor.metadata.validate()) {
      this.editor.saveMetadata(false, (r: any) => {
        if (r && r.errors && r.status === -4) {
          this.confirmSave(String(this.translator.instant('common.warning')), r.errors.mods[0].errorMessage, true);
        }
      });
    } else {
      this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', false);
    }
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        // this.editor.saveModsFromCatalog(result['mods'], () => {});
        this.editor.updateModsFromCatalog(result['mods']);
        setTimeout(() => {
          const a = this.editor.metadata.validate();
          if (!a) {
            this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', false);
          }
        }, 100);
      }
    });
  }

}
