import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { Metadata } from 'src/app/model/metadata.model';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { ModsSubject } from 'src/app/model/mods/subject.model';
import { CodebookService } from 'src/app/services/codebook.service';
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-editor-subject',
  templateUrl: './editor-subject.component.html',
  styleUrls: ['./editor-subject.component.scss']
})
export class EditorSubjectComponent implements OnInit {

  @Input() field: ElementField;
  @Input() model: string;

  constructor(
    public codebook: CodebookService, 
    private dialog: MatDialog, 
    private tmpl: TemplateService,
    public layout: LayoutService) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = this.layout.lastSelectedItem.model;
    }
  }

  addRepeated(item: any) {
    const val = item.getSubfields()[0].items[0].controls['lang'].value;
    const newItem: ModsSubject = <ModsSubject>this.field.addAfterItem(item);
    // newItem.topics.items[0].attrs.lang = item.topics.items[0].attrs.lang;
      newItem.getSubfields()[0].items[0].switchCollapsed();
    setTimeout(() => {
      this.layout.setMetadataResized();
      newItem.getSubfields()[0].items[0].controls['lang'].setValue(val)
    }, 10);
  }

  onLoadFromCatalog(item: any) {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'authors' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result['mods']) {
        const mods = result['mods'];

        const standard = Metadata.resolveStandard(mods);
        // console.log(standard)
        this.tmpl.getTemplate(standard, this.layout.lastSelectedItem.model).subscribe((tmpl: any) => {
          const metadata = new Metadata('', this.layout.lastSelectedItem.model, mods, 0, standard, tmpl);
          const mf = metadata.getField(ModsSubject.getSelector());
          // const items = nameField.getItems();
          if (mf && mf.items.length > 0) {
            this.field.addAfterItem(item, mf.items[0]);
            setTimeout(() => {
              this.field.removeItem(item);
              setTimeout(() => {
                this.layout.setMetadataResized();
              }, 10);
            }, 10);
          }
        });

      }
    });
  }


}
