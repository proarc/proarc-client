import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';
import { Metadata } from 'src/app/model/metadata.model';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { ModsSubject } from 'src/app/model/mods/subject.model';
import { ApiService } from 'src/app/services/api.service';
import { CodebookService } from 'src/app/services/codebook.service';
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-editor-subject',
  templateUrl: './editor-subject.component.html',
  styleUrls: ['./editor-subject.component.scss']
})
export class EditorSubjectComponent implements OnInit {

  @Input() panel: ILayoutPanel;
  @Input() field: ElementField;
  @Input() model: string;

  constructor(
    private api: ApiService,
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
    console.log(item);
    const topic = item.getSubfields().find((sf: any) => sf.id === 'topic');
    const val = topic.items[0].controls['lang'].value;
    const newItem: ModsSubject = <ModsSubject>this.field.addAfterItem(item);
    const newTopic = newItem.getSubfields().find((sf: any) => sf.id === 'topic');

    //  topic.items[0].switchCollapsed();

    setTimeout(() => {
      this.layout.setMetadataResized();
      newTopic.items[0].controls['lang'].setValue(val)
    }, 10);
  }

  onLoadFromCatalog(item: any) {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'authors' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result['mods']) {
        const mods = result['mods'];

        this.api.addAuthority(this.layout.lastSelectedItem.pid, mods).subscribe((resp: any) => {
          this.layout.clearPanelEditing();
            this.layout.refreshSelectedItem(true, 'metadata');
        });

        // const standard = Metadata.resolveStandard(mods);
        // this.tmpl.getTemplate(standard, this.layout.lastSelectedItem.model).subscribe((tmpl: any) => {
        //   const metadata = new Metadata('', this.layout.lastSelectedItem.model, mods, 0, standard, tmpl);
        //   const mf = metadata.getField(ModsSubject.getSelector());
        //   if (mf && mf.items.length > 0) {
        //     this.field.addAfterItem(item, mf.items[0]);
        //     setTimeout(() => {
        //       this.field.removeItem(item);
        //       setTimeout(() => {
        //         this.layout.setMetadataResized();
        //       }, 10);
        //     }, 10);
        //   }
        // });

      }
    });
  }


}
