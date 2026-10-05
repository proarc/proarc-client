import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { Device } from '../../model/device.model';
import { Software, SOFTWARE_MODELS } from '../../model/software.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';

@Component({
  selector: 'app-editor-atm-multiple',
  imports: [FormsModule, TranslateModule, MatButtonModule, MatFormFieldModule,
    MatIconModule, MatProgressBarModule, MatSelectModule, MatTooltipModule, EditorSwitcherComponent],
  templateUrl: './editor-atm-multiple.component.html',
  styleUrls: ['./editor-atm.component.scss']
})
export class EditorAtmMultipleComponent implements OnInit {
  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();
  devices: Device[] = [];
  softwares: Software[] = [];
  device: string = null;
  software: string = null;
  state = 'loading';
  pids: string[] = [];
  private destroyRef = inject(DestroyRef);

  constructor(public layout: LayoutService, public settings: UserSettings,
    private api: ApiService, private ui: UIService, private translator: TranslateService) {}

  ngOnInit() {
    this.layout.selectionChanged().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const pids = this.layout.getSelected().map(item => item.pid);
      if (pids.join(',') !== this.pids.join(',')) {
        this.pids = pids;
        this.onRevert();
      }
    });
    forkJoin({ devices: this.api.getDevices(), softwares: this.api.getAllSoftware(SOFTWARE_MODELS.set) })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: ({ devices, softwares }) => {
          this.devices = devices;
          this.softwares = softwares;
          this.state = 'success';
        },
        error: () => this.state = 'error'
      });
  }

  hasChanged(): boolean {
    return this.device !== null || this.software !== null;
  }

  onChange() {
    if (this.hasChanged()) {
      this.layout.setPanelEditing(this.panel());
    } else if (this.layout.editingPanel === this.panel()?.id) {
      this.layout.clearPanelEditing();
    }
  }

  onRevert() {
    this.device = null;
    this.software = null;
    this.onChange();
  }

  onSave() {
    if (!this.hasChanged() || this.pids.length < 2 || this.state !== 'success') {
      return;
    }
    this.state = 'saving';
    this.api.editAtmDevices(this.pids, this.device, this.software, this.layout.batchId)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: response => {
          if (response.response.errors || response.response.status < 0) {
            this.ui.showErrorDialogFromObject(response.response.errors || response.response);
            this.state = 'success';
            return;
          }
          this.onRevert();
          this.state = 'success';
          this.ui.showInfoSnackBar(this.translator.instant('snackbar.changeSaved'));
        },
        error: () => this.state = 'success'
      });
  }

  regeneratePremis() {
    if (this.hasChanged() || this.pids.length < 2 || this.state !== 'success') {
      return;
    }
    this.state = 'saving';
    this.api.regeneratePremis(this.pids, this.layout.batchId)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: response => {
          this.state = 'success';
          if (response.response.errors || response.response.status < 0) {
            this.ui.showErrorDialogFromObject(response.response.errors || response.response);
            return;
          }
          this.ui.showInfoSnackBar(this.translator.instant('editor.atm.premisRegenerated'));
        },
        error: () => {
          this.state = 'success';
          this.ui.showErrorSnackBar(this.translator.instant('editor.atm.premisRegenerationFailed'));
        }
      });
  }
}
