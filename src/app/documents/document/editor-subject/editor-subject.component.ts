import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { Metadata } from 'src/app/model/metadata.model';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { ModsSubject } from 'src/app/model/mods/subject.model';
import { CodebookService } from 'src/app/services/codebook.service';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-editor-subject',
  templateUrl: './editor-subject.component.html',
  styleUrls: ['./editor-subject.component.scss']
})
export class EditorSubjectComponent implements OnInit {

  @Input() field: ElementField;

  constructor(public codebook: CodebookService, private dialog: MatDialog, public editor: EditorService) {
  }

  ngOnInit() {
  }

  onLoadFromCatalog(item) {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'authors' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        const mods = result['mods'];
        const metadata = new Metadata('', this.editor.metadata.model, mods, 0);
        const nameField = metadata.getField(ModsSubject.getSelector());
        const items = nameField.getItems();
        if (nameField && items.length > 0) {
          this.field.addAfterItem(item, items[0]);
          this.field.removeItem(item);
        }
      }
    });
  }


}
