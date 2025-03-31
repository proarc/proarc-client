import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { Note } from '../../model/note.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    EditorSwitcherComponent],
  selector: 'app-editor-comment',
  templateUrl: './editor-comment.component.html',
  styleUrls: ['./editor-comment.component.scss']
})
export class EditorCommentComponent implements OnInit {
  
  pid = input<string>();
  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();
  
  state = 'none';
  editting = false;
  note: Note;
  anyChange: boolean;


  constructor(
    private layout: LayoutService,
    private api: ApiService,
    private ui: UIService) {
      effect(() => {
        const pid = this.pid();
        if (!pid) {
          return;
        }
        this.onPidChanged(pid);
      });
  }

  ngOnInit() {
  }

  onEdit() {
    this.editting = true;
  }

  onClear() {
    this.editting = false;
    this.anyChange = false;
    this.layout.clearPanelEditing();
    this.note.restore();
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.state = 'saving';
    this.api.editNote(this.note, this.layout.batchId).subscribe((newNote: Note) => {
      this.note = newNote;
      this.editting = false;
      this.anyChange = false;
      this.layout.clearPanelEditing();
      this.state = 'success';
    });
  }

  onChange() {
    this.anyChange = true;
    this.layout.setPanelEditing(this.panel());
  }


  private onPidChanged(pid: string) {
    this.anyChange = false;
    this.layout.clearPanelEditing();
    this.editting = false;
    this.state = 'loading';
    this.api.getNote(pid, this.layout.batchId).subscribe((note: Note) => {
      this.note = note;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

}
