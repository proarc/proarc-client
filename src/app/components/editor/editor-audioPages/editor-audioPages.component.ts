import { CodebookService } from './../../../services/codebook.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';

@Component({
  selector: 'app-editor-audioPages',
  templateUrl: './editor-audioPages.component.html',
  styleUrls: ['./editor-audioPages.component.scss']
})
export class EditorAudioPagesComponent implements OnInit {

  @Input() panel: ILayoutPanel; 
  holder: AudioPagesUpdateHolder;
  pageIndexControl = new FormControl();
  applyControl = new FormControl();
  controls: FormGroup = new FormGroup({
    pageIndexControl: this.pageIndexControl,
    applyControl: this.applyControl
  });

  state: string;

  constructor(
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public config: ConfigService,
    public layout: LayoutService,
    public codebook: CodebookService) {
  }

  ngOnInit() {
    this.holder = new AudioPagesUpdateHolder();
    this.controls.valueChanges.subscribe((e: any) => {
      this.layout.isDirty = this.controls.dirty;
    })
  }

  canSave(): boolean {
    const hasChanges = this.holder.editAny();
    if (hasChanges) {
      this.layout.setPanelEditing(this.panel);
    } else {
      if (this.panel.canEdit) {
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
    // this.holder.reset();
    this.controls.markAsPristine();
    this.layout.isDirty = false;
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
    for (const item of this.layout.items) {
      if (item.isAudioPage() && item.selected) {
        pages.push(item.pid);
      }
    }
    this.api.editAudioPages(pages, holder, this.layout.getBatchId()).subscribe((result: any) => {
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

