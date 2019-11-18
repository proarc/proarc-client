import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { Note } from 'src/app/model/note.model';

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
    this.note.restore();
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.editor.saveNote(this.note, (note: Note) => {
      this.note = note;
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
    this.api.getNote(pid).subscribe((note: Note) => {
      this.note = note;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
