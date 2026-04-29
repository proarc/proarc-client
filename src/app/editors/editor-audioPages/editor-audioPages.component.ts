import { Component, input, Input, OnInit } from '@angular/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  selector: 'app-editor-audioPages',
  templateUrl: './editor-audioPages.component.html',
  styleUrls: ['./editor-audioPages.component.scss']
})
export class EditorAudioPagesComponent implements OnInit {

  panel = input<ILayoutPanel>();
  holder: AudioPagesUpdateHolder;
  pageIndexControl = new FormControl();
  applyControl = new FormControl();
  controls: FormGroup = new FormGroup({
    pageIndex: this.pageIndexControl,
    applyControl: this.applyControl
  });

  state: string;

  constructor(
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public config: Configuration,
    public layout: LayoutService,
    public settings: UserSettings) {
  }

  ngOnInit() {
    this.holder = new AudioPagesUpdateHolder();
  }

  canSave(): boolean {
    const hasChanges = this.holder.editAny();
    if (hasChanges) {
      this.layout.setPanelEditing(this.panel());
    } else {
      if (this.panel().canEdit) {
        this.layout.clearPanelEditing();
      }
    }

    return hasChanges
  }

  onSave() {
    if (!this.canSave()) {
      return;
    }
    this.updateSelectedPages(this.holder, null);
    this.holder.reset();
    this.controls.markAsPristine();
    this.layout.clearPanelEditing();
  }

  enterSelect(s: MatSelect) {
    s.close();
    this.onSave();
  }


  updateSelectedPages(holder: AudioPagesUpdateHolder, callback: () => void) {
    // if (this.preparation) {
    //     this.editSelectedBatchPages(holder, callback);
    //     return;
    // }
    this.state = 'saving';
    const pages = [];
    for (const item of this.layout.items()) {
      if (item.isAudioPage() && item.selected) {
        pages.push(item.pid);
      }
    }
    this.api.editAudioPages(pages, holder, this.layout.batchId).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
        this.state = 'error';
      } else {
        this.layout.setShouldRefresh(true);
      }
    })
  }
}

export class AudioPagesUpdateHolder {

  applyOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  editIndex: boolean;
  pageIndex: number;

  applyTo: number;
  applyToFirst: boolean;

  constructor() {
    this.editIndex = false;
    this.pageIndex = 1;

    this.applyTo = 1;
    this.applyToFirst = true;
  }

  editAny(): boolean {
    return this.editIndex;
  }

  reset() {
    this.editIndex = false;
  }
}

