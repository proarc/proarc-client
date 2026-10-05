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
import { Premis, PremisElementTemplate, PremisField, PremisGroup } from '../../model/premis.model';
import { TemplateService } from '../../services/template.service';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';

@Component({
  selector: 'app-editor-premis',
  imports: [NgTemplateOutlet, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatProgressBarModule, MatTooltipModule, TranslateModule, EditorSwitcherComponent, Highlight],
  templateUrl: './editor-premis.component.html',
  styleUrl: './editor-premis.component.scss'
})
export class EditorPremisComponent implements OnDestroy {
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
  private request: Subscription;

  constructor(public layout: LayoutService, private api: ApiService, private ui: UIService,
    public settings: UserSettings, private translator: TranslateService, private templates: TemplateService) {
    effect(() => {
      const pid = this.pid();
      const model = this.model();
      const notSaved = this.notSaved();
      const xmlMode = this.panelType() === 'premisXML';
      this.request?.unsubscribe();
      this.premis = null;
      this.xmlMode = xmlMode;
      this.xmlEditing = false;
      if (!pid || !['model:page', 'model:ndkpage', 'model:oldprintpage'].includes(model) ||
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
    this.request = forkJoin({record: this.api.getPremis(pid, this.layout.batchId),
      template: this.templates.getPremisTemplate()}).subscribe({
      next: ({record, template}) => {
        if (!record || record.status < 0 || record.response?.errors) {
          this.fail(record?.response?.errors || record?.data);
          return;
        }
        if (!record.content?.trim()) {
          this.state = 'empty';
          return;
        }
        try {
          if (record.timestamp === null || record.timestamp === undefined || !Number.isFinite(Number(record.timestamp))) {
            throw new Error('Missing timestamp');
          }
          this.premis = new Premis(record.content, Number(record.timestamp), template);
          this.xml = record.content;
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
    return !!this.premis && (this.xmlMode ? this.xmlEditing && this.xml !== this.premis.xml : this.premis.hasChanged());
  }

  changed(): void {
    if (this.hasChanged()) {
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
    this.premis.restore();
    this.xml = this.premis.xml;
    this.xmlEditing = false;
    this.changed();
  }

  editXml(): void {
    if (!this.xmlMode || !this.isRepository() || this.state !== 'success' || !this.panel()?.canEdit) {
      return;
    }
    this.xml = this.premis.xml;
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
      xml = this.xmlMode ? new Premis(this.xml, this.premis.timestamp).serialize() : this.premis.serialize();
    } catch {
      this.ui.showErrorSnackBar(this.translator.instant('editor.premis.invalidXml'));
      return;
    }
    this.state = 'saving';
    this.request = this.api.savePremis(this.pid(), xml, this.premis.timestamp, false, this.layout.batchId).subscribe({
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
        this.ui.showErrorSnackBar(this.translator.instant('editor.premis.saveFailed'));
      }
    });
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
