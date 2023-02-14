import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { Metadata } from 'src/app/model/metadata.model';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { ModsSubject } from 'src/app/model/mods/subject.model';
import { CodebookService } from 'src/app/services/codebook.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-subject',
  templateUrl: './editor-subject.component.html',
  styleUrls: ['./editor-subject.component.scss']
})
export class EditorSubjectComponent implements OnInit {

  @Input() field: ElementField;
  @Input() model: string;

  constructor(public codebook: CodebookService, private dialog: MatDialog, public layout: LayoutService) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = this.layout.lastSelectedItem.model;
    }
  }

  onLoadFromCatalog(item: any) {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'authors' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result['mods']) {
        const mods = result['mods'];
        const metadata = new Metadata('', this.layout.lastSelectedItem.model, mods, 0, null);
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
