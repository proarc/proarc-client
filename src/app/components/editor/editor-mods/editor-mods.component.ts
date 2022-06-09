import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Mods } from 'src/app/model/mods.model';
import { EditorService } from 'src/app/services/editor.service';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor-mods',
  templateUrl: './editor-mods.component.html',
  styleUrls: ['./editor-mods.component.scss']
})
export class EditorModsComponent implements OnInit, OnDestroy {

  @ViewChild('editingPre') editingPre : ElementRef;
  @ViewChild('originalPre') originalPre : ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  mods: Mods;
  anyChange: boolean;
  lastPid: string;

  originalText = '';


  private rightDocumentSubscription: Subscription;


  // @Input()
  // set pid(pid: string) {
  //   this.onPidChanged(pid);
  // }

  constructor(public editor: EditorService, private api: ApiService) {
  }

  ngOnInit() {
    this.rightDocumentSubscription = this.editor.watchRightDocument().subscribe(
      (item: DocumentItem) => {
        if (item) {
          this.reload(item);
        }
      }
    );
    this.reload(this.editor.right);
  }

  ngAfterViewInit() {
    
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
    this.originalText = this.originalPre.nativeElement.innerText;
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
    // console.log(this.editingPre);
    // return;
    if (!this.anyChange || this.realtime) {
      return;
    }
    this.mods.content = this.editingPre.nativeElement.innerText;
    this.editor.saveMods(this.mods, false, (mods: Mods) => {
      this.mods = mods;
      this.editting = false;
      this.anyChange = false;
    });
  }

  checkChanged() {
    //console.log(this.editingPre.nativeElement.innerText, this.originalText)
    this.anyChange = this.editingPre.nativeElement.innerText !== this.originalText;
  }

  onChange() {
    this.anyChange = true;
  }


  private reload(item: DocumentItem) {
    if (item) {
      this.lastPid = item.pid;
      this.setRealtime(false);
    }
  }

  private loadMods() {
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getMods(this.lastPid, this.editor.getBatchId()).subscribe((mods: any) => {
      this.mods =  Mods.fromJson(mods['record']);
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

  ngOnDestroy() {
    if (this.rightDocumentSubscription) {
      this.rightDocumentSubscription.unsubscribe();
    }
  }

}
