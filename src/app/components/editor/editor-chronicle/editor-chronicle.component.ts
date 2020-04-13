import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-editor-chronicle',
  templateUrl: './editor-chronicle.component.html',
  styleUrls: ['./editor-chronicle.component.scss']
})
export class EditorChronicleComponent implements OnInit {

  state = 'none';

  languages = ['eng', 'cze',  'fre',  'heb',  'ita',  'lat',  'ger',  'pol',  'por', 'rus',  'gre',  'slo',  'grc',  'spa',  'mul',  'zxx'];

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  constructor(public editor: EditorService) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.editor.loadMetadata(() => {
      this.state = 'success';
    });
  }

  onSave() {
    this.editor.saveMetadata(() => {
    });
  }

}
