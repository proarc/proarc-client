import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CatalogDialogComponent } from '../../dialogs/catalog-dialog/catalog-dialog.component';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { AutocompleteComponent } from '../../forms/autocomplete/autocomplete.component';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { ModsSubject } from '../../model/mods/subject.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { TemplateService } from '../../services/template.service';
import { Configuration } from '../../shared/configuration';
import { FieldCodebookComponent } from "../../forms/field-codebook/field-codebook.component";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, MatButtonModule,
    MatIconModule, MatTooltipModule,
    EditorFieldComponent, FieldDropdownComponent, FieldTextComponent, FieldCodebookComponent],
  selector: 'app-editor-subject',
  templateUrl: './editor-subject.component.html',
  styleUrls: ['./editor-subject.component.scss']
})
export class EditorSubjectComponent implements OnInit {

  @Input() panel: ILayoutPanel;
  @Input() field: ElementField;

  constructor(
    private api: ApiService,
    public codebook: Configuration,
    private dialog: MatDialog,
    private tmpl: TemplateService,
    public layout: LayoutService) {
  }

  ngOnInit() {
  }

  addRepeated(item: any) {
    const topic = item.getSubfields().find((sf: any) => sf.id === 'topic');
    const val = topic.items[0].controls['lang'].value;
    const newItem: ModsSubject = <ModsSubject>this.field.addAfterItem(item);
    const newTopic = newItem.getSubfields().find((sf: any) => sf.id === 'topic');

    //  topic.items[0].switchCollapsed();

    setTimeout(() => {
      // this.layout.setMetadataResized();
      newTopic.items[0].controls['lang'].setValue(val)
    }, 10);
  }

  onLoadFromCatalog(item: any) {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'authors' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result['mods']) {
        const mods = result['mods'];

        this.api.addAuthority(this.layout.lastSelectedItem().pid, mods).subscribe((resp: any) => {
          this.layout.clearPanelEditing();
            this.layout.refreshSelectedItem(true, 'metadata');
        });

      }
    });
  }


}
