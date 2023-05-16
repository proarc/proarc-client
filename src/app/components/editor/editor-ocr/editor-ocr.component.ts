import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Ocr } from 'src/app/model/ocr.model';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';

@Component({
  selector: 'app-editor-ocr',
  templateUrl: './editor-ocr.component.html',
  styleUrls: ['./editor-ocr.component.scss']
})
export class EditorOcrComponent implements OnInit {

  // --- #268 ----
  @Input('editorType') editorType: string;
  @Input('panel') panel: ILayoutPanel;
  @Output() onIngest = new EventEmitter<boolean>();

  switchableTypes = ['mods', 'metadata', 'atm', 'ocr']
  switchable: boolean = true;

  /* ngOnChanges(c: SimpleChange) {
    this.switchable = this.switchableTypes.includes(this.editorType);
  } */

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
  // --- #368 ----

  state = 'none';
  editting = false;
  ocr: Ocr;
  anyChange: boolean;

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  @Input() pid: string;

  constructor(
    public layout: LayoutService, 
    private api: ApiService,
    private ui: UIService) {
  }

  ngOnInit() {
    // this.layout.selectionChanged().subscribe(() => {
    //   this.anyChange = false;
    //   this.editting = false;
    //   this.loadOcr();
    // });
    // this.loadOcr();
  }

  ngOnChanges(c: SimpleChange) {
    if (!this.pid) {
      return;
    }
    this.anyChange = false;
    this.editting = false;
    this.loadOcr();
  }

  loadOcr() {
    if (!this.layout.lastSelectedItem) {
      return;
    }
    this.state = 'loading';

    this.api.getOcr(this.layout.lastSelectedItem.pid, this.layout.getBatchId()).subscribe((ocr: Ocr) => {
      this.ocr = ocr;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

  onEdit() {
    this.editting = true;
  }

  onClear() {
    this.editting = false;
    this.anyChange = false;
    this.ocr.restore();
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.state = 'saving';
    this.api.editOcr(this.ocr, this.layout.getBatchId()).subscribe((newOcr: Ocr) => {
      this.ocr = newOcr;
      this.editting = false;
      this.anyChange = false;
      this.state = 'success';
    });
  }

  onChange() {
    this.anyChange = true;
  }

}
