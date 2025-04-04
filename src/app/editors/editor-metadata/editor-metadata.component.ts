import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ElementRef, ViewChild, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Subscription } from 'rxjs';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { DocumentItem } from '../../model/documentItem.model';
import { Metadata } from '../../model/metadata.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { TemplateService } from '../../services/template.service';
import { UIService } from '../../services/ui.service';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';
import { MatRadioModule } from '@angular/material/radio';
import { EditorTitleComponent } from "../editor-title/editor-title.component";

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatRadioModule,
    EditorSwitcherComponent, EditorTitleComponent]
  ,
  selector: 'app-editor-metadata',
  templateUrl: './editor-metadata.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-metadata.component.scss']
})
export class EditorMetadataComponent implements OnInit {

  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();

  notSaved: boolean;
  loading: boolean;
  pid: string;
  model: string;
  metadata: Metadata;

  @ViewChild("scroller", { static: false }) scroller: ElementRef;

  public item: DocumentItem | null;
  public visible = true;

  public fieldIds: { [key: string]: any } = {};
  public fields: { [key: string]: any } = {};
  public availableFields: string[];
  public availableFieldsSorted: string[] = [];
  public visibleFields: { [key: string]: boolean } = {};
  public selectedField: string;
  public byField: boolean = true;
  showGenreSwitch: boolean;

  fieldsOrder: string[];
  fieldsPositions: { id: string, top: number, bottom: number, height: number }[];
  subscriptions: Subscription[] = [];

  isValidMetadata = true;
  hasChanges = false;

  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private tmpl: TemplateService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog) {
    effect(() => {
      this.pid = this.layout.lastSelectedItem().pid;
      this.model = this.layout.lastSelectedItem().model;
      this.loadMetadata();
    })
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

  loadMetadata() {
    this.loading = true;
    this.api.getMetadata(this.pid).subscribe(respMeta => {
      const standard = respMeta['record']['standard'] ? respMeta['record']['standard'] : Metadata.resolveStandardFromXml(respMeta['record']['content']);
      this.tmpl.getTemplate(standard, this.model).subscribe((tmpl: any) => {
        this.metadata = new Metadata(this.pid, this.model, respMeta['record']['content'], respMeta['record']['timestamp'], standard, tmpl);
        console.log(this.metadata);

        this.visibleFields = {};
        Object.keys(this.metadata.template).forEach(k => {
          this.fieldIds[k] = true;
          this.fields[k] = this.metadata.getField(k);
          this.visibleFields[k] = true;
        });

        this.loading = false;
      })
    });
  }

  onLoadFromCatalog() {
    // const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result['mods']) {
    //     this.saveModsFromCatalog(result['mods'], result['catalogId']);
    //   }
    // });
  }

  validate() {
    this.isValidMetadata = this.metadata.validate();
    console.log(this.isValidMetadata, this.model)
      setTimeout(() => {
        // this.onSizeChanged();
      }, 10);
  }

  onSave() {
    console.log(this.metadata);
    console.log(this.metadata.toMods())
  }

  revert() {
    this.layout.clearPanelEditing();
    this.metadata = null;
    this.loadMetadata();
  }

  hasPendingChanges(): boolean {
    if (!this.metadata) {
      return false;
    }
    if (!this.panel().canEdit) {
      return false;
    }
    this.hasChanges = this.metadata.hasChanges();
    const focused = document.activeElement;
    const panel = document.getElementById(this.panel().id);
    const isChild = panel.contains(focused);
    if (isChild && this.hasChanges) {
      this.layout.setPanelEditing(this.panel());
    }
    return this.hasChanges;
  }

}
