import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Ocr } from 'src/app/model/ocr.model';
import { EditorService } from 'src/app/services/editor.service';

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

  @Input() 
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(private editor: EditorService, private api: ApiService) {
  }

  ngOnInit() {
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
    this.editor.saveOcr(this.ocr, (ocr: Ocr) => {
      this.ocr = ocr;
      this.editting = false;
      this.anyChange = false;
    });
  }

  onChange() {
    this.anyChange = true;
  }


  private onPidChanged(pid: string) {
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getOcr(pid).subscribe((ocr: Ocr) => {
      this.ocr = ocr;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
