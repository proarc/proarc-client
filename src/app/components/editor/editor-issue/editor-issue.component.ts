import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-editor-issue',
  templateUrl: './editor-issue.component.html',
  styleUrls: ['./editor-issue.component.scss']
})
export class EditorIssueComponent implements OnInit {

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
