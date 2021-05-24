import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { EditorTitleComponent } from 'src/app/documents/document/editor-title/editor-title.component';
import { EditorPublisherComponent } from 'src/app/documents/document/editor-publisher/editor-publisher.component';

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

  onSave() {
    if (this.editor.metadata.validate()) {
      this.editor.saveMetadata(() => {
      });
    } else {
      // TODO show warning dialog
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
