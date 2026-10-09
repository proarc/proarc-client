import { Component, effect, input, output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { Highlight } from 'ngx-highlightjs';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Premis, PremisElementTemplate, PremisField, PremisGroup, PremisTemplate } from '../../model/premis.model';
import { TemplateService } from '../../services/template.service';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';

@Component({
  selector: 'app-editor-premis',
  imports: [MatSelectModule, MatAutocompleteModule, NgTemplateOutlet, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatProgressBarModule, MatTooltipModule, TranslateModule, EditorSwitcherComponent, Highlight],
  templateUrl: './editor-premis.component.html',
  styleUrl: './editor-premis.component.scss'
})
export class EditorPremisComponent implements OnDestroy {
  metadataType = input<'premis' | 'copyrightMD'>('premis');
  pid = input<string>();
  model = input<string>();
  notSaved = input<boolean>(false);
  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();

  state = 'none';
  premis: Premis;
  xmlMode = false;
  xmlEditing = false;
  xml = '';
  displayXml = '';
  previewXml = '';
  private request: Subscription;
  copyrightMode = false;
  metadataKey = 'editor.premis.';
  exists = false;
  creating = false;
  deletePending = false;
  private timestamp = -1;
  private template: PremisTemplate = {elements: {}};

  constructor(public layout: LayoutService, private api: ApiService, private ui: UIService,
    public settings: UserSettings, private translator: TranslateService, private templates: TemplateService) {
    effect(() => {
      const pid = this.pid();
      const model = this.model();
      const notSaved = this.notSaved();
      this.copyrightMode = this.metadataType() === 'copyrightMD';
      this.metadataKey = this.copyrightMode ? 'editor.copyrightMD.' : 'editor.premis.';
      const xmlMode = this.panelType() === 'premisXML' || this.panelType() === 'copyrightMDXML';
      this.request?.unsubscribe();
      this.premis = null;
      this.xmlMode = xmlMode;
      this.xmlEditing = false;
      this.creating = false;
      this.deletePending = false;
      const supported = this.copyrightMode ? !!model && !['model:page', 'model:ndkpage', 'model:oldprintpage', 'model:ndkaudiopage'].includes(model)
        : ['model:page', 'model:ndkpage', 'model:oldprintpage'].includes(model);
      if (!pid || !supported ||
          notSaved || !this.isRepository()) {
        this.state = 'unsupported';
        return;
      }
      this.load(pid);
    });
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  load(pid = this.pid()): void {
    if (!this.isRepository()) {
      this.request?.unsubscribe();
      this.premis = null;
      this.state = 'unsupported';
      return;
    }
    this.state = 'loading';
    this.creating = false;
    this.exists = false;
    this.request = forkJoin({record: this.copyrightMode ? this.api.getCopyrightMd(pid) : this.api.getPremis(pid, this.layout.batchId),
      template: this.copyrightMode ? this.templates.getCopyrightMdTemplate() : this.templates.getPremisTemplate()}).subscribe({
      next: ({record, template}) => {
        if (!record || record.status < 0 || record.response?.errors) {
          this.fail(record?.response?.errors || record?.data);
          return;
        }
        this.template = template;
        this.timestamp = Number(record.timestamp);
        if (!Number.isFinite(this.timestamp) || record.timestamp == null) { this.fail(); return; }
        this.exists = !!record.content?.trim();
        if (!this.exists) {
          this.state = 'empty';
          if (this.copyrightMode) { this.createDraft(); }
          return;
        }
        try {
          if (record.timestamp === null || record.timestamp === undefined || !Number.isFinite(Number(record.timestamp))) {
            throw new Error('Missing timestamp');
          }
          this.premis = new Premis(record.content, Number(record.timestamp), template);
          this.xml = record.content;
          this.displayXml = this.copyrightMode ? Premis.formatXml(record.content) : record.content;
          this.previewXml = Premis.formatXml(record.content, true);
          this.xmlEditing = false;
          this.state = 'success';
        } catch {
          this.fail();
        }
      },
      error: () => this.fail()
    });
  }

  hasChanged(): boolean {
    return this.creating || this.hasUserChanges();
  }

  private hasUserChanges(): boolean {
    return !!this.premis && (this.xmlMode ? this.xmlEditing && this.xml !== this.displayXml : this.premis.hasChanged());
  }

  changed(): void {
    if (this.hasUserChanges()) {
      this.layout.setPanelEditing(this.panel());
    } else if (this.layout.editingPanel === this.panel()?.id) {
      this.layout.clearPanelEditing();
    }
  }

  elementLabel(item: PremisElementTemplate): string {
    return item.label || Premis.humanize(item.name);
  }

  canEdit(): boolean {
    return this.state === 'success' && !!this.panel()?.canEdit && this.isRepository();
  }

  addElement(group: PremisGroup, item: PremisElementTemplate): void {
    if (this.canEdit()) {
      this.premis.addElement(group, item);
      group.expanded = true;
      this.changed();
    }
  }

  addGroupAfter(group: PremisGroup): void {
    if (this.canEdit()) {
      this.premis.addGroupAfter(group);
      this.changed();
    }
  }

  addFieldAfter(group: PremisGroup, field: PremisField): void {
    if (this.canEdit()) {
      this.premis.addFieldAfter(group, field);
      this.changed();
    }
  }

  removeGroup(group: PremisGroup): void {
    if (this.canEdit()) {
      this.premis.removeGroup(group);
      this.changed();
    }
  }

  removeField(group: PremisGroup, field: PremisField): void {
    if (this.canEdit()) {
      this.premis.removeField(group, field);
      this.changed();
    }
  }

  revert(): void {
    if (this.creating) { this.layout.clearPanelEditing(); this.load(); return; }
    this.premis.restore();
    this.xml = this.premis.xml;
    this.displayXml = this.copyrightMode ? Premis.formatXml(this.premis.xml) : this.premis.xml;
    this.previewXml = Premis.formatXml(this.premis.xml, true);
    this.xmlEditing = false;
    this.changed();
  }

  editXml(): void {
    if (!this.xmlMode || !this.isRepository() || this.state !== 'success' || !this.panel()?.canEdit) {
      return;
    }
    this.xml = this.displayXml;
    this.xmlEditing = true;
  }

  xmlChanged(event: Event): void {
    if (!this.xmlEditing || this.state !== 'success' || !this.panel()?.canEdit) {
      return;
    }
    this.xml = (event.target as HTMLElement).innerText;
    this.changed();
  }

  refresh(): void {
    if (this.state === 'success' && !this.xmlEditing && !this.hasChanged()) {
      this.load();
    }
  }

  save(): void {
    if (!this.isRepository() || this.state !== 'success' || !this.hasChanged() || !this.panel()?.canEdit) {
      return;
    }
    let xml: string;
    try {
      xml = this.xmlMode ? new Premis(this.xml, this.premis.timestamp, this.template).serialize() : this.premis.serialize();
      if (this.copyrightMode && !this.xmlMode) {
        xml = Premis.formatXml(xml, true);
      }
    } catch {
      this.ui.showErrorSnackBar(this.translator.instant(this.metadataKey + 'invalidXml'));
      return;
    }
    this.state = 'saving';
    this.request = (this.copyrightMode ? this.api.saveCopyrightMd(this.pid(), xml, this.premis.timestamp)
      : this.api.savePremis(this.pid(), xml, this.premis.timestamp, false, this.layout.batchId)).subscribe({
      next: response => {
        if (!response || response.errors || response.status < 0 || !response.data?.length) {
          this.state = 'success';
          this.ui.showErrorDialogFromObject(response?.errors || response || {});
          return;
        }
        this.layout.clearPanelEditing();
        this.ui.showInfoSnackBar(this.translator.instant('snackbar.changeSaved'));
        // Read the server's updated document and concurrency timestamp.
        this.load();
      },
      error: () => {
        this.state = 'success';
        this.ui.showErrorSnackBar(this.translator.instant(this.metadataKey + 'saveFailed'));
      }
    });
  }

  private createDraft(): void {
    const xml = '<copyright xmlns="http://www.cdlib.org/inside/diglib/copyrightMD" copyright.status="unknown" publication.status="unknown"/>';
    this.premis = new Premis(xml, this.timestamp, this.template);
    const populate = (group: PremisGroup) => {
      this.premis.missingElements(group).forEach(item => this.premis.addElement(group, item));
      group.children.forEach(populate);
    };
    this.premis.roots.forEach(populate);
    // The complete form remains a local draft until the user saves it.
    this.premis = new Premis(this.premis.serialize(), this.timestamp, this.template);
    this.displayXml = Premis.formatXml(this.premis.xml, true);
    this.previewXml = Premis.formatXml(this.premis.xml, true);
    this.xml = this.displayXml;
    this.creating = true;
    this.xmlEditing = false;
    this.state = 'success';
  }

  deleteMetadata(): void {
    if (!this.copyrightMode || !this.isRepository() || !this.exists || this.state !== 'success' || this.hasChanged() || !this.panel()?.canEdit) { return; }
    this.state = 'saving';
    this.request = this.api.deleteCopyrightMd(this.pid(), this.premis.timestamp).subscribe({
      next: response => {
        if (!response || response.errors || response.status < 0) {
          this.state = 'success';
          this.ui.showErrorDialogFromObject(response?.errors || response || {});
          return;
        }
        this.layout.clearPanelEditing();
        this.load();
      },
      error: () => { this.state = 'success'; this.ui.showErrorSnackBar(this.translator.instant(this.metadataKey + 'saveFailed')); }
    });
  }

  changePanelType(type: string): void {
    if (this.hasUserChanges()) {
      this.ui.showInfoSnackBar(this.translator.instant(this.metadataKey + 'saveXmlFirst'));
      return;
    }
    this.onChangePanelType.emit(type);
  }

  private isRepository(): boolean {
    return this.layout.type === 'repo' && this.layout.batchId == null;
  }

  private fail(errors?: any): void {
    this.state = 'failure';
    if (errors) {
      this.ui.showErrorDialogFromObject(errors);
    }
  }
}
