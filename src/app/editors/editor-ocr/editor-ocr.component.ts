import { CommonModule } from '@angular/common';
import { Component, OnInit, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { Ocr } from '../../model/ocr.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    EditorSwitcherComponent],
  selector: 'app-editor-ocr',
  templateUrl: './editor-ocr.component.html',
  styleUrls: ['./editor-ocr.component.scss']
})
export class EditorOcrComponent {

  pid = input<string>();
  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();
  onIngest = output<boolean>();

  switchableTypes = ['mods', 'metadata', 'atm', 'ocr']
  switchable: boolean = true;

  countPlurals(): string {
    let count = this.layout.getNumOfSelected();
    if (count > 4) {
      return '5'
    } else if (count > 1) {
      return '4'
    } else {
      return count + '';
    }
  }

  state = 'none';
  editting = false;
  ocr: Ocr;
  anyChange: boolean;

  constructor(
    public layout: LayoutService,
    private api: ApiService,
    private ui: UIService) {
    effect(() => {
      const pid = this.pid();
      if (!pid) {
        return;
      }
      this.anyChange = false;
      this.editting = false;
      this.layout.clearPanelEditing();
      this.loadOcr(pid);
    });
  }

  loadOcr(pid: string) {
    if (!this.layout.lastSelectedItem) {
      return;
    }
    this.state = 'loading';

    this.api.getOcr(pid, this.layout.batchId).subscribe((ocr: Ocr) => {
      this.ocr = ocr;
      this.state = 'success';
    });
  }

  onEdit() {
    this.editting = true;
  }

  onClear() {
    this.editting = false;
    this.anyChange = false;
    this.layout.clearPanelEditing();
    this.ocr.restore();
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.state = 'saving';
    this.api.editOcr(this.ocr, this.layout.batchId).subscribe((newOcr: Ocr) => {
      this.ocr = newOcr;
      this.editting = false;
      this.anyChange = false;
      this.state = 'success';
      this.layout.clearPanelEditing();
    });
  }

  onChange() {
    this.anyChange = true;
    this.layout.setPanelEditing(this.panel());
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

  onPERO() {
    this.api.generateAlto(this.pid()).subscribe(response => {
      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar(response.response.data[0].msg)
      }
    });

  }

}
