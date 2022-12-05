import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Note } from 'src/app/model/note.model';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-comment',
  templateUrl: './editor-comment.component.html',
  styleUrls: ['./editor-comment.component.scss']
})
export class EditorCommentComponent implements OnInit {

  state = 'none';
  editting = false;
  note: Note;
  anyChange: boolean;

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(
    private layout: LayoutService,
    private api: ApiService,
    private ui: UIService) {
  }

  ngOnInit() {
  }

  onEdit() {
    this.editting = true;
  }

  onClear() {
    this.editting = false;
    this.anyChange = false;
    this.note.restore();
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.state = 'saving';
    this.api.editNote(this.note, this.layout.getBatchId()).subscribe((newNote: Note) => {
      this.note = newNote;
      this.editting = false;
      this.anyChange = false;
      this.state = 'success';
    });
  }

  onChange() {
    this.anyChange = true;
  }


  private onPidChanged(pid: string) {
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getNote(pid, this.layout.getBatchId()).subscribe((note: Note) => {
      this.note = note;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
