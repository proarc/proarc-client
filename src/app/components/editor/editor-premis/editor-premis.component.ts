import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Mods } from 'src/app/model/mods.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { parseString, processors } from 'xml2js';

@Component({
  selector: 'app-editor-premis',
  templateUrl: './editor-premis.component.html',
  styleUrls: ['./editor-premis.component.scss']
})
export class EditorPremisComponent implements OnInit {

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  @ViewChild('editingPre') editingPre: ElementRef;
  @ViewChild('originalPre') originalPre: ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  mods: Mods;
  anyChange: boolean;
  lastPid: string;

  originalText = '';

  // metadata: Metadata;

  item: DocumentItem;

  public visible = true;

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  constructor(
    public layout: LayoutService,
    private api: ApiService,
    private ui: UIService,) { }

  ngOnInit(): void {
  }

  onPidChanged(pid: string) {
    // this.loadData(pid)
    this.reload();
  }

  // loadData(pid: string) {
  //   this.api.getPremis(pid).subscribe((resp: any) => {
  //     this.parseXml(resp.record.content)
  //   });
  // }

  // private parseXml(mods: string) {
  //   const xml = mods.replace(/xmlns.*=".*"/g, '');
  //   const data = {tagNameProcessors: [processors.stripPrefix], explicitCharkey: true};
  //   const ctx = this;
  //   parseString(xml, data, function (err: any, result: any) {
  //       // ctx.processMods(result);
  //       console.log(result)
  //   });
  // }

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
    this.api.editModsXml(mods.pid, mods.content, mods.timestamp, ignoreValidation, this.layout.getBatchId()).subscribe((resp: any) => {
      if (resp.errors) {
        this.state = 'error';
        this.ui.showErrorSnackBar(resp.errors.mods[0].errorMessage)
      } else {
        this.api.getMods(mods.pid, this.layout.getBatchId()).subscribe((response: any) => {

          if (response.errors) {
            this.state = 'error';
            this.ui.showErrorSnackBar(response.errors.mods[0].errorMessage)
          } else {
            const newMods: Mods = Mods.fromJson(response['record']);
            this.mods = newMods;
            this.editting = false;
            this.anyChange = false;
            this.state = 'success';
            this.layout.refreshSelectedItem(true, 'metadata');
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


  private reload() {
    this.item = this.layout.lastSelectedItem;
    if (this.item) {
      this.visible = true;
      this.lastPid = this.item.pid;
      this.setRealtime(false);
      // this.loadMods();
    } else {
      this.visible = false;
    }
  }

  private loadMods() {
    this.mods = null;
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getPremis(this.lastPid).subscribe((response: any) => {
      if (response && response['record']) {
        this.mods = Mods.fromJson(response['record']);
        this.state = 'success';
      } else if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
      } else {
        this.state = 'success';
      }
    });
  }

}