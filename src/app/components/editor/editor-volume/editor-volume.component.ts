import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-editor-volume',
  templateUrl: './editor-volume.component.html',
  styleUrls: ['./editor-volume.component.scss']
})
export class EditorVolumeComponent implements OnInit {

  state = 'none';

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
