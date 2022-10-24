import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Ocr } from 'src/app/model/ocr.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-ocr',
  templateUrl: './editor-ocr.component.html',
  styleUrls: ['./editor-ocr.component.scss']
})
export class EditorOcrComponent implements OnInit {

  state = 'none';
  editting = false;
  ocr: Ocr;
  anyChange: boolean;

  @Input() pid: string;

  constructor(private layout: LayoutService, private api: ApiService) {
  }

  ngOnInit() {
    this.layout.selectionChanged().subscribe(() => {
      this.anyChange = false;
      this.editting = false;
      this.loadOcr();
    });
    this.loadOcr();
  }

  ngOnChanges(c: SimpleChange) {
    // if (!this.pid) {
    //   return;
    // }
    // this.anyChange = false;
    // this.editting = false;
    // this.loadOcr();
  }

  loadOcr() {
    if (!this.layout.selectedItem) {
      return;
    }
    this.state = 'loading';

    this.api.getOcr(this.layout.selectedItem.pid, this.layout.getBatchId()).subscribe((ocr: Ocr) => {
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
