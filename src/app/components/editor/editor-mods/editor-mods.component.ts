import { Component, OnInit, Input } from '@angular/core';
import { Mods } from 'src/app/model/mods.model';
import { EditorService } from 'src/app/services/editor.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-editor-mods',
  templateUrl: './editor-mods.component.html',
  styleUrls: ['./editor-mods.component.scss']
})
export class EditorModsComponent implements OnInit {

  state = 'none';
  editting = false;
  mods: Mods;
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
    this.mods.restore();
  }

  onSave() {
    if (!this.anyChange) {
      return;
    }
    this.editor.saveMods(this.mods, (mods: Mods) => {
      console.log('returned mods', mods);
      this.mods = mods;
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
    this.api.getMods(pid).subscribe((mods: Mods) => {
      this.mods = mods;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
