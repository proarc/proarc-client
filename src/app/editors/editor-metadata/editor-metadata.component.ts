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

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatRadioModule,
    EditorSwitcherComponent]
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
  state = 'none';
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

  loadMetadata() {
    this.api.getMetadata(this.pid).subscribe(respMeta => {
      const standard = respMeta['record']['standard'] ? respMeta['record']['standard'] : Metadata.resolveStandardFromXml(respMeta['record']['content']);
      this.tmpl.getTemplate(standard, this.model).subscribe((tmpl: any) => {
        this.metadata = new Metadata(this.pid, this.model, respMeta['record']['content'], respMeta['record']['timestamp'], standard, tmpl);
        console.log(this.metadata)
      })
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

  ngOnInit() {

  }

}
