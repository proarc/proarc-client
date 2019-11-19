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

  realtime = false;
  state = 'none';
  editting = false;
  mods: Mods;
  anyChange: boolean;
  lastPid: string;

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(public editor: EditorService, private api: ApiService) {
  }

  ngOnInit() {
  }

  public setRealtime(enable: boolean) {
    if (enable) {
      this.onClear();
    } else {
      this.loadMods();
    }
    this.realtime = enable;
  }

  onEdit() {
    if (this.realtime) {
      return;
    }
    this.editting = true;
  }

  onClear() {
    if (this.realtime) {
      return;
    }
    this.editting = false;
    this.anyChange = false;
    this.mods.restore();
  }

  onRefresh() {
    if (this.editting || this.realtime) {
      return;
    }
    this.loadMods();
  }

  onSave() {
    if (!this.anyChange || this.realtime) {
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
    this.lastPid = pid;
    this.setRealtime(false);
  }

  private loadMods() {
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getMods(this.lastPid).subscribe((mods: Mods) => {
      this.mods = mods;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
