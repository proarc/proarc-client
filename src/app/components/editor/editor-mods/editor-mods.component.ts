import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, SimpleChange } from '@angular/core';
import { Mods } from 'src/app/model/mods.model';
import { EditorService } from 'src/app/services/editor.service';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Subscription } from 'rxjs';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-mods',
  templateUrl: './editor-mods.component.html',
  styleUrls: ['./editor-mods.component.scss']
})
export class EditorModsComponent implements OnInit, OnDestroy {

  @Input('item') item: DocumentItem;

  @ViewChild('editingPre') editingPre: ElementRef;
  @ViewChild('originalPre') originalPre: ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  mods: Mods;
  anyChange: boolean;
  lastPid: string;

  originalText = '';


  private rightDocumentSubscription: Subscription;

  constructor(
    public repo: RepositoryService, 
    private ui: UIService,
    private api: ApiService) {
  }

  ngOnInit() {
    // this.rightDocumentSubscription = this.repo.selectionChanged().subscribe(
    //   () => {
    //     if (this.item) {
    //       if (this.item.notSaved) {
    //         this.mods = Mods.fromJson(this.item.content);
    //       } else {
    //         this.reload(this.item);
    //       }
    //     }
    //   }
    // );
    // this.reload(this.item);
  }

  ngOnChanges(c: SimpleChange) {
    if (this.item) {
      this.reload(this.item);
    }
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
    this.saveMods(this.mods, false);


  }

  saveMods(mods: Mods, ignoreValidation: boolean) {
    this.state = 'saving';
    this.api.editModsXml(mods.pid, mods.content, mods.timestamp, ignoreValidation, null).subscribe((resp: any) => {
      if (resp.errors) {
        this.state = 'error';
        this.ui.showErrorSnackBar(resp.errors.mods[0].errorMessage)
      } else {
        this.api.getMods(mods.pid, null).subscribe((response: any) => {

          if (response.errors) {
            this.state = 'error';
            this.ui.showErrorSnackBar(response.errors.mods[0].errorMessage)
          } else {
            const newMods: Mods = Mods.fromJson(response['record']);
            this.mods = newMods;
            this.editting = false;
            this.anyChange = false;
            this.state = 'success';
          }
        });
      }

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
    this.api.getMods(this.lastPid, null).subscribe((mods: any) => {
      this.mods = Mods.fromJson(mods['record']);
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
