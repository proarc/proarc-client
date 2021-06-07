import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { EditorTitleComponent } from 'src/app/documents/document/editor-title/editor-title.component';
import { EditorPublisherComponent } from 'src/app/documents/document/editor-publisher/editor-publisher.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';

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
  constructor(public editor: EditorService, private dialog: MatDialog) { }

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

  onSave() {
    if (this.editor.metadata.validate()) {
      this.editor.saveMetadata(() => {
      });
    } else {

      const data: SimpleDialogData = {
        title: "Nevalidní data",
        message: "Nevalidní data, přejete si dokument přesto uložit.",
        btn1: {
          label: "Ano",
          value: 'yes',
          color: 'primary'
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
          this.editor.saveMetadata(() => {
          });
        }
      });


      // TODO show warning dialog
      // this.editor.saveMetadata(() => {
      // });
    }
  }

  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.editor.updateModsFromCatalog(result['mods'], () => {

        });
      }
    });
  }

}
